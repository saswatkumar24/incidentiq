import datetime

class MockSlackClient:
    def __init__(self):
        # Stores channel messages by channel name
        self.channels = {}
        # Logs notifications sent to stakeholders
        self.notifications_log = []

    def create_war_room(self, incident_id: str) -> dict:
        # Normalize incident ID to lowercase for Slack channels
        clean_id = str(incident_id).replace("-", "").lower()
        channel_name = f"#inc-{clean_id}-warroom"
        
        if channel_name not in self.channels:
            self.channels[channel_name] = []
            
        print(f"[MockSlackClient] Created Slack war room: {channel_name}")
        return {"channel": channel_name}

    def post_message(self, channel: str, message: str) -> dict:
        if channel not in self.channels:
            self.channels[channel] = []
            
        timestamp = datetime.datetime.utcnow().isoformat()
        msg_payload = {
            "timestamp": timestamp,
            "message": message,
            "sender": "IncidentIQ-Bot"
        }
        self.channels[channel].append(msg_payload)
        print(f"[MockSlackClient] Posted to {channel}: {message}")
        return msg_payload

    def notify_stakeholders(self, severity: str, contacts: list) -> dict:
        log_entry = {
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "severity": severity,
            "contacts_notified": contacts
        }
        self.notifications_log.append(log_entry)
        print(f"[MockSlackClient] Notified stakeholders ({severity}): {contacts}")
        return log_entry
