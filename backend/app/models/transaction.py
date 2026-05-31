from sqlalchemy import Column, Date, Float, Integer, String

from app.database.base import Base


class Transaction(Base):
    # Table name used by SQLAlchemy for storing transaction records.
    __tablename__ = "transactions"

    # Unique transaction identifier and primary key.
    id = Column(Integer, primary_key=True, index=True)

    # Merchant name or short transaction description.
    description = Column(String, nullable=False)

    # Transaction amount, such as an expense or income value.
    amount = Column(Float, nullable=False)

    # Expense category assigned to the transaction.
    category = Column(String, nullable=False)

    # Date when the transaction occurred.
    transaction_date = Column(Date, nullable=False)
