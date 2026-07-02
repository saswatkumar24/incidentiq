import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL")

# If DATABASE_URL is not configured, fallback to SQLite
if not DATABASE_URL:
    DATABASE_URL = "sqlite:///./incidentiq.db"

# Format the database URL for SQLite compatibility if needed
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

try:
    engine = create_engine(DATABASE_URL, connect_args=connect_args)
    # Test connection
    with engine.connect() as conn:
        pass
    print(f"Successfully connected to database at: {DATABASE_URL}")
except Exception as e:
    print(f"Warning: Failed to connect to {DATABASE_URL}. Error: {e}")
    print("Falling back to local SQLite database: sqlite:///./incidentiq.db")
    DATABASE_URL = "sqlite:///./incidentiq.db"
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency to get db session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
