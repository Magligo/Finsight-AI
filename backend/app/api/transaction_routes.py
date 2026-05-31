from datetime import date
import logging

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.transaction import Transaction
from ml.category_predictor import categorize_transaction, normalize_merchant_name


# Router groups all transaction CRUD endpoints under one module.
router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"],
)
logger = logging.getLogger(__name__)


class TransactionCreate(BaseModel):
    # Merchant name or transaction description sent in the request body.
    description: str

    # Transaction amount sent in the request body.
    amount: float

    # Expense category sent in the request body.
    category: str

    # Date of the transaction sent in the request body.
    transaction_date: date


class TransactionResponse(TransactionCreate):
    # Database-generated transaction identifier returned in API responses.
    id: int

    # Allows FastAPI to serialize SQLAlchemy ORM objects as response models.
    model_config = ConfigDict(from_attributes=True)


@router.post("", response_model=TransactionResponse)
def create_transaction(transaction: TransactionCreate, db: Session = Depends(get_db)):
    # Purpose: Create a new transaction record from the request body.
    # Request flow: FastAPI validates the incoming JSON using TransactionCreate.
    # Categorization: normalize the merchant and assign its category before insert.
    # Database interaction: A SQLAlchemy model object is added and committed.
    transaction_data = transaction.model_dump()
    merchant_name = normalize_merchant_name(transaction.description)
    category = categorize_transaction(merchant_name)

    # Logging verification: records the exact merchant/category pair being saved.
    logger.info("Merchant: %s", merchant_name)
    logger.info("Category: %s", category)

    transaction_data["description"] = merchant_name
    transaction_data["category"] = category

    db_transaction = Transaction(**transaction_data)
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction


@router.get("", response_model=list[TransactionResponse])
def get_transactions(db: Session = Depends(get_db)):
    # Purpose: Return all stored transactions.
    # Request flow: No request body is needed for this read operation.
    # Database interaction: SQLAlchemy queries every Transaction row.
    return db.query(Transaction).all()


@router.get("/{transaction_id}", response_model=TransactionResponse)
def get_transaction(transaction_id: int, db: Session = Depends(get_db)):
    # Purpose: Return one transaction by its database id.
    # Request flow: FastAPI reads transaction_id from the URL path.
    # Database interaction: SQLAlchemy searches for the matching Transaction row.
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction


@router.put("/{transaction_id}", response_model=TransactionResponse)
def update_transaction(
    transaction_id: int,
    transaction_data: TransactionCreate,
    db: Session = Depends(get_db),
):
    # Purpose: Update an existing transaction by id.
    # Request flow: FastAPI reads the id from the path and update data from JSON.
    # Database interaction: SQLAlchemy loads the row, updates fields, and commits.
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")

    updated_data = transaction_data.model_dump()
    merchant_name = normalize_merchant_name(transaction_data.description)
    category = categorize_transaction(merchant_name)

    # Logging verification: records the normalized merchant/category on updates too.
    logger.info("Merchant: %s", merchant_name)
    logger.info("Category: %s", category)

    updated_data["description"] = merchant_name
    updated_data["category"] = category

    for field, value in updated_data.items():
        setattr(transaction, field, value)

    db.commit()
    db.refresh(transaction)
    return transaction


@router.delete("/{transaction_id}")
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    # Purpose: Delete one transaction by id.
    # Request flow: FastAPI reads transaction_id from the URL path.
    # Database interaction: SQLAlchemy loads the row, deletes it, and commits.
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")

    db.delete(transaction)
    db.commit()
    return {"message": "Transaction deleted successfully"}
