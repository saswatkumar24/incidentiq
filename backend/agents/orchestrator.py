import json
import time
import sys
import os
import asyncio
import re
import requests
from datetime import datetime
import google.generativeai as genai

from agents.compat import Crew, Task, Agent, tool, CREWAI_AVAILABLE
from config import get_llm, GEMINI_MODEL
from agents.triage_agent import create_triage_agent, classify_incident_tool
from agents.rca_agent import create_rca_agent, nr_client
from agents.runbook_agent import create_runbook_agent, confluence_client
from agents.comms_agent import create_comms_agent, slack_client
from agents.jira_agent import create_jira_agent, jira_client
from agents.postmortem_agent import create_postmortem_agent

from database.db import SessionLocal
from database.models import Incident, AgentExecution, MockJiraTicket, MockSlackMessage

# Helper to parse JSON from agent text outputs
def parse_agent_json(output_str: str) -> dict:
    try:
        cleaned = output_str.strip()
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()
        return json.loads(cleaned)
    except Exception as e:
        print(f"[Orchestrator] JSON parsing failed for agent output: {e}. Output: {output_str}")
        return {"raw_output": output_str}

# Direct Gemini execution helper with stdout flushes using httpx (prevents gRPC deadlocks)
async def run_gemini_fallback(prompt: str, temperature: float = 0.3, scenario_name: str = None, agent_name: str = None, on_backoff = None, run_index: int = 0) -> str:
    print(f"[Orchestrator-Gemini] Invoking async REST generation (model={GEMINI_MODEL}, temp={temperature})...")
    sys.stdout.flush()
    
    import hashlib
    # Hash the prompt to generate a cache key
    prompt_hash = hashlib.md5((prompt + f"__temp_{temperature}").encode("utf-8")).hexdigest()
    
    # Under demo environment, scenario_name + agent_name + run_index is a much more stable cache key
    # than prompt_hash, because prompt_hash changes dynamically due to unique incident_ids.
    cache_key = f"{scenario_name}__{agent_name}__run_{run_index}" if (scenario_name and agent_name) else prompt_hash
    
    # Try reading cache
    cache_file = os.path.join(os.path.dirname(os.path.dirname(__file__)), "gemini_cache.json")
    cache_data = {}
    if os.path.exists(cache_file):
        try:
            with open(cache_file, "r") as f:
                cache_data = json.load(f)
        except Exception:
            pass
            
    if cache_key in cache_data:
        print(f"[Orchestrator-Gemini] Cache HIT for {agent_name} in scenario {scenario_name}!")
        sys.stdout.flush()
        return cache_data[cache_key]

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        if scenario_name and agent_name:
            from agents.mock_fallback_data import FALLBACK_DATA
            if scenario_name in FALLBACK_DATA and agent_name in FALLBACK_DATA[scenario_name]:
                fallback_obj = FALLBACK_DATA[scenario_name][agent_name]
                fallback_text = json.dumps(fallback_obj, indent=2)
                print(f"[Orchestrator-Gemini] No API Key. Loaded fallback data for scenario={scenario_name}, agent={agent_name}.")
                sys.stdout.flush()
                return fallback_text
        raise ValueError("No Gemini API key found in environment variables.")
        
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={api_key}"
    headers = {
        "Content-Type": "application/json"
    }
    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt
                    }
                ]
            }
        ],
        "generationConfig": {
            "temperature": temperature
        }
    }
    
    import httpx
    max_retries = 5
    default_backoff = 5.0
    
    for attempt in range(1, max_retries + 1):
        response = None
        try:
            print(f"[Orchestrator-Gemini] Sending post request (attempt {attempt}/{max_retries})...")
            sys.stdout.flush()
            async with httpx.AsyncClient(timeout=120.0) as client:
                response = await client.post(url, headers=headers, json=payload)
                
            if response.status_code != 200:
                raise Exception(f"Gemini REST API returned status code {response.status_code}: {response.text}")
                
            res_data = response.json()
            
            # Verify structure of response
            if "candidates" not in res_data or not res_data["candidates"]:
                raise Exception(f"Gemini REST response lacks candidates: {res_data}")
                
            candidate = res_data["candidates"][0]
            if "content" not in candidate or "parts" not in candidate["content"] or not candidate["content"]["parts"]:
                finish_reason = candidate.get("finishReason")
                raise Exception(f"Gemini REST response empty or blocked. Reason: {finish_reason}. Full: {res_data}")
                
            text = candidate["content"]["parts"][0]["text"]
            print(f"[Orchestrator-Gemini] Async REST Generation succeeded on attempt {attempt}.")
            sys.stdout.flush()
            
            # Save to cache
            cache_data[cache_key] = text
            try:
                with open(cache_file, "w") as f:
                    json.dump(cache_data, f, indent=2)
            except Exception:
                pass
                
            return text
            
        except Exception as e:
            print(f"[Orchestrator-Gemini] Async REST Generation attempt {attempt} failed with error: {repr(e)}")
            sys.stdout.flush()
            
            if attempt == max_retries:
                # If we exhausted all attempts, check if we have fallback data
                if scenario_name and agent_name:
                    from agents.mock_fallback_data import FALLBACK_DATA
                    if scenario_name in FALLBACK_DATA and agent_name in FALLBACK_DATA[scenario_name]:
                        fallback_obj = FALLBACK_DATA[scenario_name][agent_name]
                        fallback_text = json.dumps(fallback_obj, indent=2)
                        print(f"[Orchestrator-Gemini] Live API failed after {max_retries} attempts. Loaded fallback data for scenario={scenario_name}, agent={agent_name}.")
                        sys.stdout.flush()
                        
                        # Cache the fallback text so next time it is instantaneous
                        cache_data[cache_key] = fallback_text
                        try:
                            with open(cache_file, "w") as f:
                                json.dump(cache_data, f, indent=2)
                        except Exception:
                            pass
                        return fallback_text
                raise e
            
            # Use backoff_seconds parsed from 429 if present, else use default_backoff
            sleep_time = default_backoff
            is_429 = False
            if response is not None and response.status_code == 429:
                is_429 = True
                try:
                    err_data = response.json()
                    details = err_data.get("error", {}).get("details", [])
                    for detail in details:
                        if detail.get("@type") == "type.googleapis.com/google.rpc.RetryInfo":
                            delay_str = detail.get("retryDelay", "")
                            match = re.match(r"([\d\.]+)\s*s", delay_str)
                            if match:
                                sleep_time = float(match.group(1)) + 1.5
                                print(f"[Orchestrator-Gemini] Parsed dynamic retry delay from API: {sleep_time}s")
                                sys.stdout.flush()
                                break
                except Exception as parse_err:
                    pass
            
            # If on_backoff callback is registered, notify the user/frontend
            if on_backoff:
                msg = "Gemini API Rate Limit (429) reached" if is_429 else f"Gemini API Request failed ({repr(e)})"
                try:
                    await on_backoff(msg, sleep_time)
                except Exception:
                    pass
            
            print(f"[Orchestrator-Gemini] Backing off for {sleep_time} seconds before next attempt...")
            sys.stdout.flush()
            await asyncio.sleep(sleep_time)
            default_backoff *= 2.0





class IncidentOrchestrator:
    def __init__(self, incident_id: str, scenario_name: str, alert_payload: dict, ws_callback=None):
        self.incident_id = incident_id
        self.scenario_name = scenario_name
        self.alert_payload = alert_payload
        self.ws_callback = ws_callback
        self.db = SessionLocal()

    async def emit(self, event_type: str, agent_name: str, payload: dict):
        if self.ws_callback:
            event = {
                "type": event_type,
                "agent": agent_name,
                "ts": datetime.utcnow().isoformat(),
                **payload
            }
            # Execute async callback
            if asyncio.iscoroutinefunction(self.ws_callback):
                await self.ws_callback(event)
            else:
                self.ws_callback(event)

    def log_execution_to_db(self, agent_name: str, started_at: datetime, completed_at: datetime, input_data: dict, output_data: dict, confidence: float):
        try:
            duration = int((completed_at - started_at).total_seconds())
            exec_record = AgentExecution(
                incident_id=self.incident_id,
                agent_name=agent_name,
                started_at=started_at,
                completed_at=completed_at,
                duration_seconds=duration,
                input_data=input_data,
                output_data=output_data,
                confidence_score=confidence
            )
            self.db.add(exec_record)
            self.db.commit()
            print(f"[Orchestrator] Saved execution log for {agent_name} to database.")
            sys.stdout.flush()
        except Exception as e:
            self.db.rollback()
            print(f"[Orchestrator] Error logging execution: {e}")
            sys.stdout.flush()

    async def run(self):
        print(f"[Orchestrator] Starting incident handler for incident {self.incident_id}. Mode: {'CrewAI' if CREWAI_AVAILABLE else 'Direct Gemini Fallback'}")
        sys.stdout.flush()
        
        # Calculate run_index to dynamically rotate root causes
        try:
            from database.models import Incident
            incident_count = self.db.query(Incident).filter(Incident.scenario_name == self.scenario_name).count()
            if incident_count >= 2:
                run_index = (incident_count - 2) % 3
            else:
                run_index = 0
        except Exception as e:
            print(f"[Orchestrator] Error computing incident count: {e}")
            run_index = 0
            
        print(f"[Orchestrator] Computed run_index for scenario '{self.scenario_name}': {run_index}")
        sys.stdout.flush()
        
        triage_report = {}
        rca_report = {}
        runbook_report = {}
        comms_report = {}
        jira_report = {}
        postmortem_report = {}
        
        loop = asyncio.get_event_loop()

        try:
            # -------------------------------------------------------------
            # STEP 1: TRIAGE AGENT
            # -------------------------------------------------------------
            agent_name = "triage_agent"
            await self.emit("agent_started", agent_name, {})
            await self.emit("agent_thinking", agent_name, {"thought": "Parsing alert payload and evaluating blast radius..."})
            
            t1_start = datetime.utcnow()
            triage_agent = create_triage_agent()
            
            # Execute triage tool directly as it contains deterministic rules
            triage_out = classify_incident_tool(json.dumps(self.alert_payload))
            triage_report = parse_agent_json(triage_out)
            
            # Artificial sleep for UI timeline pacing/drama
            await asyncio.sleep(2.0)
            t1_end = datetime.utcnow()
            
            # Save triage incident metadata updates
            incident = self.db.query(Incident).filter(Incident.id == self.incident_id).first()
            if incident:
                incident.severity = triage_report.get("severity", "P2")
                incident.service_name = triage_report.get("service", "unknown-service")
                self.db.commit()

            self.log_execution_to_db(
                agent_name=agent_name,
                started_at=t1_start,
                completed_at=t1_end,
                input_data=self.alert_payload,
                output_data=triage_report,
                confidence=triage_report.get("confidence", 0.96)
            )
            await self.emit("agent_completed", agent_name, {"result": triage_report, "duration_seconds": int((t1_end - t1_start).total_seconds())})
            await asyncio.sleep(0.5)

            # -------------------------------------------------------------
            # STEP 2: RCA AGENT
            # -------------------------------------------------------------
            agent_name = "rca_agent"
            await self.emit("agent_started", agent_name, {})
            await self.emit("agent_thinking", agent_name, {"thought": f"Querying logs, metrics, and recent deployments for {triage_report.get('service')}..."})
            
            t2_start = datetime.utcnow()
            rca_agent = create_rca_agent()
            
            if CREWAI_AVAILABLE:
                rca_task = Task(
                    description=f"Given the triage report: {json.dumps(triage_report)}, query metrics, logs, recent deployments, "
                                f"and historical incidents for service: {triage_report.get('service')}. Correlate the current telemetry "
                                "with historical root causes (such as upstream outages, expired SSL certs, or DB pool starvation). "
                                "Deduce the most likely root cause by comparing the current evidence against these historical possibilities. "
                                "Provide a detailed root_cause description explaining the comparison, confidence score, evidence, and contributing factors. "
                                "Format output strictly as JSON.",
                    expected_output="JSON keys: root_cause, confidence, evidence, contributing_factors",
                    agent=rca_agent
                )
                crew2 = Crew(agents=[rca_agent], tasks=[rca_task], verbose=True)
                rca_out = await loop.run_in_executor(None, crew2.kickoff)
            else:
                # Query mock data directly in Python
                metrics_data = nr_client.get_metrics(triage_report.get("service"), run_index=run_index)
                logs_data = nr_client.get_logs(triage_report.get("service"), run_index=run_index)
                deploy_data = nr_client.get_recent_deployments(triage_report.get("service"), run_index=run_index)
                
                from mocks.mock_historical_data import get_historical_data_for_service
                historical_incidents = get_historical_data_for_service(triage_report.get("service"))
                
                prompt = f"""
                You are the Principal Root Cause Analysis Engineer.
                Triage Report: {json.dumps(triage_report)}
                Telemetry Metrics: {json.dumps(metrics_data)}
                Service Error Logs: {json.dumps(logs_data)}
                Recent Deployments: {json.dumps(deploy_data)}
                Historical Outages & Comments: {json.dumps(historical_incidents)}
                
                Analyze the current telemetry feeds and recent deployments to isolate the root cause.
                Important: Compare the current metrics and logs against the historical outages for this service.
                Specifically, check if the current issue resembles any of the past root causes (e.g. database pool limit changes, TLS certificate expiration, or upstream provider outages).
                Synthesize this comparison and explain why the current event is likely matching one of these causes (or is different).
                Explain the root cause and provide contributing factors and specific evidence.
                
                Format your response strictly as a JSON object with these keys:
                - root_cause: string description (explain your reasoning by comparing with the historical root causes)
                - confidence: float between 0.0 and 1.0
                - evidence: list of string points
                - contributing_factors: list of string points
                """
                async def on_backoff(msg: str, delay: float):
                    await self.emit("agent_thinking", agent_name, {
                        "thought": f"⚠️ {msg}. Pausing to reset quota... Retrying in {delay:.1f}s"
                    })
                rca_out = await run_gemini_fallback(prompt, 0.2, self.scenario_name, agent_name, on_backoff, run_index=run_index)
                
            rca_report = parse_agent_json(rca_out)
            
            # Pacing sleep
            await asyncio.sleep(3.0)
            t2_end = datetime.utcnow()
            
            self.log_execution_to_db(
                agent_name=agent_name,
                started_at=t2_start,
                completed_at=t2_end,
                input_data=triage_report,
                output_data=rca_report,
                confidence=rca_report.get("confidence", 0.90)
            )
            await self.emit("agent_completed", agent_name, {"result": rca_report, "duration_seconds": int((t2_end - t2_start).total_seconds())})
            await asyncio.sleep(0.5)

            # -------------------------------------------------------------
            # STEP 3: RUNBOOK AGENT
            # -------------------------------------------------------------
            agent_name = "runbook_agent"
            await self.emit("agent_started", agent_name, {})
            await self.emit("agent_thinking", agent_name, {"thought": "Querying SRE knowledge base for recovery runbooks..."})
            
            t3_start = datetime.utcnow()
            runbook_agent = create_runbook_agent()
            
            if CREWAI_AVAILABLE:
                runbook_task = Task(
                    description=f"Given the root cause analysis report: {json.dumps(rca_report)}, search the confluence knowledge base "
                                "and retrieve the best matching runbook. Adapt the mitigation steps to fit this incident. "
                                "Format output strictly as JSON.",
                    expected_output="JSON keys: runbook_found, runbook_title, relevance_score, adapted_steps, estimated_resolution_minutes, escalation_needed",
                    agent=runbook_agent
                )
                crew3 = Crew(agents=[runbook_agent], tasks=[runbook_task], verbose=True)
                runbook_out = await loop.run_in_executor(None, crew3.kickoff)
            else:
                # Query Confluence directly in Python
                runbooks = confluence_client.search_runbooks(rca_report.get("root_cause", ""))
                
                prompt = f"""
                You are the Institutional Memory Specialist.
                Root Cause diagnosed: {rca_report.get('root_cause')}
                Matching Runbooks found: {json.dumps(runbooks)}
                
                Select and adapt the runbook steps to create a remediation checklist for this incident.
                
                Format your response strictly as a JSON object with these keys:
                - runbook_found: boolean
                - runbook_title: string
                - relevance_score: float
                - adapted_steps: list of strings (concrete actions)
                - estimated_resolution_minutes: integer
                - escalation_needed: boolean
                """
                async def on_backoff(msg: str, delay: float):
                    await self.emit("agent_thinking", agent_name, {
                        "thought": f"⚠️ {msg}. Pausing to reset quota... Retrying in {delay:.1f}s"
                    })
                runbook_out = await run_gemini_fallback(prompt, 0.3, self.scenario_name, agent_name, on_backoff, run_index=run_index)
                
            runbook_report = parse_agent_json(runbook_out)
            
            await asyncio.sleep(2.0)
            t3_end = datetime.utcnow()
            
            self.log_execution_to_db(
                agent_name=agent_name,
                started_at=t3_start,
                completed_at=t3_end,
                input_data=rca_report,
                output_data=runbook_report,
                confidence=runbook_report.get("relevance_score", 0.90)
            )
            await self.emit("agent_completed", agent_name, {"result": runbook_report, "duration_seconds": int((t3_end - t3_start).total_seconds())})
            await asyncio.sleep(0.5)

            # -------------------------------------------------------------
            # STEP 4: COMMS AGENT
            # -------------------------------------------------------------
            agent_name = "comms_agent"
            await self.emit("agent_started", agent_name, {})
            await self.emit("agent_thinking", agent_name, {"thought": "Provisioning Slack channel and drafting stakeholder updates..."})
            
            t4_start = datetime.utcnow()
            comms_agent = create_comms_agent()
            
            if CREWAI_AVAILABLE:
                comms_task = Task(
                    description=f"Create a Slack war room channel for incident: {self.incident_id}. "
                                f"Using triage details {json.dumps(triage_report)} and root cause {json.dumps(rca_report)}, "
                                "draft a Slack announcement under 150 words using emojis (what is broken, root cause, ETA to resolve, on-call contact). "
                                "Post it to the channel and notify stakeholders. Format output strictly as JSON.",
                    expected_output="JSON keys: war_room_created, stakeholders_notified, slack_message, status_page_update, email_subject",
                    agent=comms_agent
                )
                crew4 = Crew(agents=[comms_agent], tasks=[comms_task], verbose=True)
                comms_out = await loop.run_in_executor(None, crew4.kickoff)
                comms_report = parse_agent_json(comms_out)
            else:
                war_room = slack_client.create_war_room(self.incident_id)
                prompt = f"""
                You are the SRE Communications Lead.
                Triage Report: {json.dumps(triage_report)}
                RCA Report: {json.dumps(rca_report)}
                
                Draft a professional Slack status update message (using emojis, keep it concise, under 150 words) to post in the war room channel {war_room.get('channel')}.
                
                Format your response strictly as a JSON object with these keys:
                - war_room_created: string (e.g. "{war_room.get('channel')}")
                - stakeholders_notified: list of strings (e.g. ["platform-team", "on-call-lead", "vp-engineering"])
                - slack_message: string
                - status_page_update: string
                - email_subject: string
                """
                async def on_backoff(msg: str, delay: float):
                    await self.emit("agent_thinking", agent_name, {
                        "thought": f"⚠️ {msg}. Pausing to reset quota... Retrying in {delay:.1f}s"
                    })
                comms_out = await run_gemini_fallback(prompt, 0.7, self.scenario_name, agent_name, on_backoff, run_index=run_index)
                comms_report = parse_agent_json(comms_out)
                
                # Run actual mock calls
                slack_client.post_message(war_room.get("channel"), comms_report.get("slack_message", ""))
                slack_client.notify_stakeholders(triage_report.get("severity", "P2"), comms_report.get("stakeholders_notified", []))

            await asyncio.sleep(2.0)
            t4_end = datetime.utcnow()
            
            # Save mock Slack message to DB
            slack_msg = MockSlackMessage(
                incident_id=self.incident_id,
                channel_name=comms_report.get("war_room_created", f"#inc-{self.incident_id[:8]}"),
                message_text=comms_report.get("slack_message", "Outage Alert"),
                posted_at=datetime.utcnow()
            )
            self.db.add(slack_msg)
            self.db.commit()

            self.log_execution_to_db(
                agent_name=agent_name,
                started_at=t4_start,
                completed_at=t4_end,
                input_data={"triage": triage_report, "rca": rca_report},
                output_data=comms_report,
                confidence=0.95
            )
            await self.emit("agent_completed", agent_name, {"result": comms_report, "duration_seconds": int((t4_end - t4_start).total_seconds())})
            await asyncio.sleep(0.5)

            # -------------------------------------------------------------
            # STEP 5: JIRA AGENT
            # -------------------------------------------------------------
            agent_name = "jira_agent"
            await self.emit("agent_started", agent_name, {})
            await self.emit("agent_thinking", agent_name, {"thought": "Generating Jira incident ticket and linking related tasks..."})
            
            t5_start = datetime.utcnow()
            jira_agent = create_jira_agent()
            
            related_deployments = []
            deployments_data = rca_report.get("evidence", [])
            for item in deployments_data:
                if "PROJ-" in item:
                    match = re.search(r"PROJ-\d+", item)
                    if match:
                        related_deployments.append(match.group(0))
            if not related_deployments:
                related_deployments = ["PROJ-4821"]
                
            if CREWAI_AVAILABLE:
                jira_task = Task(
                    description=f"Create a Jira ticket for this {triage_report.get('severity')} incident on service {triage_report.get('service')}. "
                                f"Write a summary description listing root cause {json.dumps(rca_report)} and remediation {json.dumps(runbook_report)}. "
                                f"Link it to related deployment tickets: {','.join(related_deployments)}. Format output strictly as JSON.",
                    expected_output="JSON keys: ticket_id, url, title, priority, assignee, labels, linked_tickets",
                    agent=jira_agent
                )
                crew5 = Crew(agents=[jira_agent], tasks=[jira_task], verbose=True)
                jira_out = await loop.run_in_executor(None, crew5.kickoff)
                jira_report = parse_agent_json(jira_out)
            else:
                prompt = f"""
                You are the Automated Ticketing Specialist.
                Triage: {json.dumps(triage_report)}
                RCA: {json.dumps(rca_report)}
                Runbook: {json.dumps(runbook_report)}
                
                Generate a formal Jira incident ticket title and detailed description (with timeline, root cause, and remediation steps).
                
                Format your response strictly as a JSON object with these keys:
                - ticket_id: string (leave empty)
                - url: string (leave empty)
                - title: string
                - priority: string ("Critical", "High", "Medium", or "Low")
                - assignee: string
                - labels: list of strings
                - linked_tickets: list of strings (e.g. ["PROJ-4821"])
                """
                async def on_backoff(msg: str, delay: float):
                    await self.emit("agent_thinking", agent_name, {
                        "thought": f"⚠️ {msg}. Pausing to reset quota... Retrying in {delay:.1f}s"
                    })
                jira_out = await run_gemini_fallback(prompt, 0.2, self.scenario_name, agent_name, on_backoff, run_index=run_index)
                jira_report = parse_agent_json(jira_out)
                
                ticket = jira_client.create_ticket(
                    title=jira_report.get("title", "Outage"),
                    description=jira_report.get("description", "Incident details"),
                    priority=jira_report.get("priority", "High"),
                    labels=jira_report.get("labels", [])
                )
                jira_client.link_tickets(ticket["ticket_id"], related_deployments)
                jira_report["ticket_id"] = ticket["ticket_id"]
                jira_report["url"] = ticket["url"]

            await asyncio.sleep(2.0)
            t5_end = datetime.utcnow()
            
            # Save mock Jira Ticket to DB
            jira_ticket = MockJiraTicket(
                ticket_id=jira_report.get("ticket_id", f"INC-2024-{self.incident_id[:4]}"),
                incident_id=self.incident_id,
                title=jira_report.get("title", "Service Outage"),
                description=jira_report.get("description", "Incident details"),
                priority=jira_report.get("priority", "Critical"),
                labels=jira_report.get("labels", ["p1", "production"]),
                created_at=datetime.utcnow()
            )
            self.db.add(jira_ticket)
            self.db.commit()

            self.log_execution_to_db(
                agent_name=agent_name,
                started_at=t5_start,
                completed_at=t5_end,
                input_data={"rca": rca_report, "runbook": runbook_report},
                output_data=jira_report,
                confidence=0.98
            )
            await self.emit("agent_completed", agent_name, {"result": jira_report, "duration_seconds": int((t5_end - t5_start).total_seconds())})
            await asyncio.sleep(0.5)

            # -------------------------------------------------------------
            # STEP 6: POST-MORTEM AGENT
            # -------------------------------------------------------------
            agent_name = "postmortem_agent"
            await self.emit("agent_started", agent_name, {})
            await self.emit("agent_thinking", agent_name, {"thought": "Assembling timeline and drafting blameless post-mortem report..."})
            
            t6_start = datetime.utcnow()
            postmortem_agent = create_postmortem_agent()
            
            # Build precise chronological timeline string
            timeline_str = f"""
            - 02:47:00 UTC: PagerDuty alert received. IncidentIQ autonomous response activated.
            - 02:47:04 UTC: Triage agent classified incident as {triage_report.get('severity')}. Impact: {triage_report.get('business_impact')}.
            - 02:47:15 UTC: RCA agent diagnosed root cause: {rca_report.get('root_cause')}.
            - 02:47:21 UTC: Runbook agent matched runbook '{runbook_report.get('runbook_title')}' and compiled adaptation checklist.
            - 02:47:26 UTC: Comms agent established Slack channel {comms_report.get('war_room_created')} and broadcast alert updates.
            - 02:47:27 UTC: Jira agent auto-created ticket {jira_report.get('ticket_id')} and linked active deployment {','.join(related_deployments)}.
            """
            
            if CREWAI_AVAILABLE:
                postmortem_task = Task(
                    description=f"Compile a comprehensive blameless post-mortem for incident: {self.incident_id} on service {triage_report.get('service')}. "
                                f"Include summary, timeline ({timeline_str}), root cause analysis, impact assessment, what went well, "
                                "what could be improved, lessons learned, and 5 action items with owners and due dates. "
                                "Publish the postmortem page to confluence. Format output strictly as JSON.",
                    expected_output="JSON keys: page_url, title, content",
                    agent=postmortem_agent
                )
                crew6 = Crew(agents=[postmortem_agent], tasks=[postmortem_task], verbose=True)
                postmortem_out = await loop.run_in_executor(None, crew6.kickoff)
                postmortem_report = parse_agent_json(postmortem_out)
            else:
                prompt = f"""
                You are the Post-Mortem Autowriter.
                Review the full incident state:
                - Triage: {json.dumps(triage_report)}
                - RCA: {json.dumps(rca_report)}
                - Runbook: {json.dumps(runbook_report)}
                - Slack Comms: {json.dumps(comms_report)}
                - Jira Ticket: {json.dumps(jira_report)}
                
                Timeline of events:
                {timeline_str}
                
                Write a complete, professional, blameless post-mortem report in Markdown format.
                Include sections:
                1. INCIDENT SUMMARY
                2. TIMELINE
                3. ROOT CAUSE ANALYSIS
                4. IMPACT ASSESSMENT
                5. WHAT WENT WELL
                6. WHAT COULD BE IMPROVED
                7. ACTION ITEMS (minimum 5, each with owner + due date)
                8. LESSONS LEARNED
                
                Format your response strictly as a JSON object with these keys:
                - page_url: string (leave empty)
                - title: string
                - content: string (the full markdown report text)
                """
                async def on_backoff(msg: str, delay: float):
                    await self.emit("agent_thinking", agent_name, {
                        "thought": f"⚠️ {msg}. Pausing to reset quota... Retrying in {delay:.1f}s"
                    })
                postmortem_out = await run_gemini_fallback(prompt, 0.4, self.scenario_name, agent_name, on_backoff, run_index=run_index)
                postmortem_report = parse_agent_json(postmortem_out)
                
                page = confluence_client.create_page(
                    title=postmortem_report.get("title", f"PostMortem - {self.incident_id[:8]}"),
                    content=postmortem_report.get("content", "Markdown details")
                )
                postmortem_report["page_url"] = page["url"]

            await asyncio.sleep(3.0)
            t6_end = datetime.utcnow()
            
            self.log_execution_to_db(
                agent_name=agent_name,
                started_at=t6_start,
                completed_at=t6_end,
                input_data={"timeline": timeline_str, "triage": triage_report, "rca": rca_report, "runbook": runbook_report},
                output_data=postmortem_report,
                confidence=0.92
            )
            await self.emit("agent_completed", agent_name, {"result": postmortem_report, "duration_seconds": int((t6_end - t6_start).total_seconds())})

            # -------------------------------------------------------------
            # INTEGRATED INCIDENT RESOLUTION
            # -------------------------------------------------------------
            full_report = {
                "triage": triage_report,
                "rca": rca_report,
                "runbook": runbook_report,
                "comms": comms_report,
                "jira": jira_report,
                "postmortem": postmortem_report
            }
            
            # Update parent incident
            incident = self.db.query(Incident).filter(Incident.id == self.incident_id).first()
            if incident:
                incident.resolved_at = datetime.utcnow()
                incident.mttr_minutes = runbook_report.get("estimated_resolution_minutes", 23)
                incident.status = "resolved"
                incident.full_report = full_report
                self.db.commit()
                
            print(f"[Orchestrator] Incident {self.incident_id} successfully resolved.")
            sys.stdout.flush()
            await self.emit("incident_resolved", "orchestrator", {"full_report": full_report})
            
            return full_report

        except Exception as e:
            print(f"[Orchestrator] Crash during agent execution: {e}")
            sys.stdout.flush()
            incident = self.db.query(Incident).filter(Incident.id == self.incident_id).first()
            if incident:
                incident.status = "failed"
                self.db.commit()
            
            error_payload = {"error": str(e)}
            await self.emit("incident_failed", "orchestrator", error_payload)
            raise e
        finally:
            self.db.close()
