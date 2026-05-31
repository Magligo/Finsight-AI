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
    # Test execution: use an in-memory database so tests do not change finsight.db.
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def test_transaction_crud_flow():
    # Expected behavior: POST should create a new transaction.
    create_response = client.post(
        "/transactions",
        json={
            "description": "Zomato",
            "amount": 500,
            "category": "Food",
            "transaction_date": "2026-05-30",
        },
    )
    assert create_response.status_code == 200
    transaction = create_response.json()
    assert transaction["description"] == "zomato"
    assert transaction["category"] == "Food"

    transaction_id = transaction["id"]

    # Assertion: GET by id should return the transaction that was created.
    read_response = client.get(f"/transactions/{transaction_id}")
    assert read_response.status_code == 200
    assert read_response.json()["id"] == transaction_id

    # Expected behavior: PUT should update the existing transaction.
    update_response = client.put(
        f"/transactions/{transaction_id}",
        json={
            "description": "Uber",
            "amount": 800,
            "category": "Travel",
            "transaction_date": "2026-05-30",
        },
    )
    assert update_response.status_code == 200
    assert update_response.json()["category"] == "Travel"

    # Expected behavior: DELETE should remove the transaction.
    delete_response = client.delete(f"/transactions/{transaction_id}")
    assert delete_response.status_code == 200

    # Assertion: reading a deleted transaction should return 404.
    missing_response = client.get(f"/transactions/{transaction_id}")
    assert missing_response.status_code == 404
