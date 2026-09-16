import os
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from database.db import engine, Base
from database.seed_data import seed_db
from api.routes_incident import router as incident_router
from api.routes_agents import router as agents_router
from api.routes_demo import router as demo_router
from api.websocket_manager import manager

# Load environmental variables
load_dotenv()

# Initialize database schemas and seed records on startup
Base.metadata.create_all(bind=engine)
try:
    seed_db()
except Exception as e:
    print(f"Error seeding database on startup: {e}")

app = FastAPI(
    title="IncidentIQ API",
    description="Autonomous Incident Command Center backend engine.",
    version="1.0.0"
)

# Enable CORS for frontend browser requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify front-end domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API Routers
app.include_router(incident_router)
app.include_router(agents_router)
app.include_router(demo_router)

# WebSocket streaming endpoint for incident updates
@app.websocket("/ws/incident/{incident_id}")
async def websocket_endpoint(websocket: WebSocket, incident_id: str):
    await manager.connect(incident_id, websocket)
    try:
        while True:
            # Keep the connection open and listen for client messages (heartbeats, etc.)
            data = await websocket.receive_text()
            # Send a simple echo or ignore
            await websocket.send_json({"type": "pong", "message": "heartbeat acknowledged"})
    except WebSocketDisconnect:
        manager.disconnect(incident_id, websocket)
    except Exception as e:
        print(f"[WS-ConnectionError] Connection exception: {e}")
        manager.disconnect(incident_id, websocket)

@app.get("/api/health")
def read_health():
    return {
        "status": "online",
        "service": "IncidentIQ Backend Engine",
        "environment": os.getenv("ENVIRONMENT", "demo")
    }

# Mount frontend production build if present
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "../frontend/dist"))
if os.path.exists(frontend_dist):
    from fastapi.staticfiles import StaticFiles
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="static")
else:
    @app.get("/")
    def read_root():
        return {
            "status": "online",
            "service": "IncidentIQ Backend Engine",
            "environment": os.getenv("ENVIRONMENT", "demo")
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
