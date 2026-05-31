from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.analytics_routes import router as analytics_router
from app.api.transaction_routes import router as transaction_router
from app.database.base import Base
from app.database.database import engine
from app.models import transaction


# Register model metadata so SQLAlchemy knows about the Transaction table.
transaction


# Initialize the FastAPI application instance.
app = FastAPI(
    title="FinSight AI",
    description="Initial FastAPI setup for the FinSight AI backend.",
    version="0.1.0",
)


# CORS setup: allows the React frontend to request data from the FastAPI backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Database setup: creates registered tables in the SQLite database if missing.
Base.metadata.create_all(bind=engine)


# Router registration: connects transaction CRUD endpoints to the FastAPI app.
app.include_router(transaction_router)
app.include_router(analytics_router)


# Root endpoint used to confirm that the backend application is running.
@app.get("/")
def root():
    # Return a simple JSON response with project status.
    return {
        "project": "FinSight AI",
        "status": "Running",
    }
