from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        # Maps incident_id (str) to a list of active WebSockets
        self.active_connections: dict[str, list[WebSocket]] = {}

    async def connect(self, incident_id: str, websocket: WebSocket):
        await websocket.accept()
        if incident_id not in self.active_connections:
            self.active_connections[incident_id] = []
        self.active_connections[incident_id].append(websocket)
        print(f"[WS] Client connected to incident: {incident_id}. Active connections: {len(self.active_connections[incident_id])}")

    def disconnect(self, incident_id: str, websocket: WebSocket):
        if incident_id in self.active_connections:
            if websocket in self.active_connections[incident_id]:
                self.active_connections[incident_id].remove(websocket)
            if not self.active_connections[incident_id]:
                del self.active_connections[incident_id]
        print(f"[WS] Client disconnected from incident: {incident_id}")

    async def broadcast(self, incident_id: str, message: dict):
        if incident_id in self.active_connections:
            print(f"[WS] Broadcasting event to {len(self.active_connections[incident_id])} client(s) for incident {incident_id}: {message.get('type')}")
            for websocket in self.active_connections[incident_id]:
                try:
                    await websocket.send_json(message)
                except Exception as e:
                    print(f"[WS] Broadcast failed for client: {e}")

# Global connection manager instance
manager = ConnectionManager()
