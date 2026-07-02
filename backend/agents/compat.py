import os
import sys

CREWAI_AVAILABLE = True

try:
    # Try importing CrewAI
    from crewai import Agent, Task, Crew
    from crewai.tools import tool
except ImportError:
    CREWAI_AVAILABLE = False
    
    print("[Compat] CrewAI is not available in this Python environment. Enabling direct Gemini fallback.")
    
    def tool(*args, **kwargs):
        def decorator(func):
            # Attach metadata to functions to act as tools
            func.name = kwargs.get("name") or (args[0] if args and isinstance(args[0], str) else func.__name__)
            func.description = func.__doc__ or ""
            return func
        return decorator
    
    class Agent:
        def __init__(self, role, goal, backstory, tools=None, llm=None, verbose=True, allow_delegation=False):
            self.role = role
            self.goal = goal
            self.backstory = backstory
            self.tools = tools or []
            self.llm = llm
            self.verbose = verbose
            
    class Task:
        def __init__(self, description, expected_output, agent):
            self.description = description
            self.expected_output = expected_output
            self.agent = agent
            
    class Crew:
        def __init__(self, agents, tasks, verbose=True):
            self.agents = agents
            self.tasks = tasks
            self.verbose = verbose
            
        def kickoff(self) -> str:
            # Placeholder, custom direct execution is handled in orchestrator.py
            return "{}"
