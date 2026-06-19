from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from backend.app.database.base import Base
from backend.app.database.database import get_db
from backend.app.main import app


engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def test_reset_data_deletes_transactions_and_returns_clean_dashboard():
    create_response = client.post(
        "/transactions",
        json={
            "description": "RedBus",
            "amount": 5900,
            "category": "Travel",
            "transaction_date": "2026-05-30",
        },
    )
    assert create_response.status_code == 200

    reset_response = client.delete("/api/reset-data")
    assert reset_response.status_code == 200

    payload = reset_response.json()
    assert payload["success"] is True
    assert payload["dashboard"]["total_spending"] == 0
    assert payload["dashboard"]["total_transactions"] == 0
    assert payload["dashboard"]["risk_alerts"] == []
    assert payload["dashboard"]["insights"] == []

    transactions_response = client.get("/transactions")
    assert transactions_response.status_code == 200
    assert transactions_response.json() == []
