import random

class MockJiraClient:
    def __init__(self):
        # Local in-memory ticket store
        self.tickets = {}

    def create_ticket(self, title: str, description: str, priority: str, labels: list) -> dict:
        ticket_num = random.randint(8000, 9999)
        ticket_id = f"INC-2024-{ticket_num}"
        
        ticket = {
            "ticket_id": ticket_id,
            "url": f"https://jira.internal.mock/browse/{ticket_id}",
            "title": title,
            "description": description,
            "priority": priority,
            "status": "Open",
            "assignee": "platform-oncall@company.com",
            "labels": labels,
            "linked_tickets": [],
            "comments": []
        }
        self.tickets[ticket_id] = ticket
        print(f"[MockJiraClient] Ticket {ticket_id} created: {title}")
        return ticket

    def update_ticket(self, ticket_id: str, status: str = None, comment: str = None) -> dict:
        if ticket_id not in self.tickets:
            # Create a placeholder if not present
            self.tickets[ticket_id] = {
                "ticket_id": ticket_id,
                "url": f"https://jira.internal.mock/browse/{ticket_id}",
                "title": f"Jira Ticket {ticket_id}",
                "description": "Restored placeholder description.",
                "priority": "High",
                "status": "Open",
                "assignee": "platform-oncall@company.com",
                "labels": [],
                "linked_tickets": [],
                "comments": []
            }
            
        ticket = self.tickets[ticket_id]
        if status:
            ticket["status"] = status
            print(f"[MockJiraClient] Ticket {ticket_id} status updated to: {status}")
        if comment:
            ticket["comments"].append(comment)
            print(f"[MockJiraClient] Ticket {ticket_id} comment added: {comment}")
            
        return ticket

    def link_tickets(self, parent_id: str, related_ids: list) -> dict:
        ticket = self.update_ticket(parent_id)
        for r_id in related_ids:
            if r_id not in ticket["linked_tickets"]:
                ticket["linked_tickets"].append(r_id)
        print(f"[MockJiraClient] Linked {parent_id} to tickets: {related_ids}")
        return ticket
