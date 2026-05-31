from collections import defaultdict

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.transaction import Transaction
from app.services.financial_health_score import calculate_health_score
from app.services.insight_generator import generate_insights
from app.services.ml_risk_detection import detect_anomalies


# Router groups dashboard analytics endpoints used by the React frontend.
router = APIRouter(tags=["Dashboard Analytics"])


def get_all_transactions(db):
    # Database interaction: load all transaction rows once for dashboard calculations.
    return db.query(Transaction).all()


def calculate_category_spending(transactions):
    # API calculation: group transaction amounts by expense category.
    category_spending = defaultdict(float)
    for transaction in transactions:
        category_spending[transaction.category] += transaction.amount
    return dict(category_spending)


def calculate_monthly_spending(transactions):
    # API calculation: group transaction amounts by calendar month.
    # The internal key includes year and month so January 2025 and January 2026
    # stay separate instead of being merged under the same month name.
    monthly_spending = defaultdict(float)
    for transaction in transactions:
        month_key = (
            transaction.transaction_date.year,
            transaction.transaction_date.month,
        )
        monthly_spending[month_key] += transaction.amount

    # Chart formatting: sort months chronologically and expose readable month
    # names for the X-axis while keeping the summed amount as the Y value.
    return {
        f"{month_key[0]}-{month_key[1]:02d}": {
            "month": f"{transaction_year_month_name(month_key)} {month_key[0]}",
            "total_spending": amount,
        }
        for month_key, amount in sorted(monthly_spending.items())
    }


def transaction_year_month_name(month_key):
    # Display helper: create a full month name from the numeric grouped month.
    month_names = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ]
    return month_names[month_key[1] - 1]


def detect_risk_transactions(transactions):
    # Risk alert logic: use the ML anomaly detector and keep only risky results.
    risk_analysis = detect_anomalies(transactions)
    return [
        {
            "transaction_id": transaction.id,
            "description": result["merchant"],
            "amount": result["amount"],
            "risk": "High",
        }
        for transaction, result in zip(transactions, risk_analysis)
        if result["risk_status"] == "High Risk"
    ]


def estimate_savings(total_spending):
    # Simple savings estimate used by the beginner-friendly health score service.
    monthly_budget = 50000
    return max(monthly_budget - total_spending, 0)


@router.get("/spending-analysis")
def get_spending_analysis(db: Session = Depends(get_db)):
    # Purpose: return category and monthly spending data for Plotly charts.
    # Request flow: React calls this endpoint when the dashboard loads.
    # Database interaction: transactions are read and grouped into chart-friendly data.
    transactions = get_all_transactions(db)
    category_spending = calculate_category_spending(transactions)
    monthly_spending = calculate_monthly_spending(transactions)

    return {
        "category_spending": category_spending,
        "monthly_spending": monthly_spending,
    }


@router.get("/risk-alerts")
def get_risk_alerts(db: Session = Depends(get_db)):
    # Purpose: return high-risk transactions for the dashboard alert section.
    # Request flow: React requests risk results and passes them into RiskAlertCard.
    # Database interaction: transactions are read before applying simple risk rules.
    transactions = get_all_transactions(db)
    return {
        "risk_alerts": detect_risk_transactions(transactions),
    }


@router.get("/risk-analysis")
def get_risk_analysis(db: Session = Depends(get_db)):
    # Purpose: return ML-based risk status for every transaction.
    # IsolationForest checks whether each transaction amount is normal compared
    # with the user's own spending history.
    transactions = get_all_transactions(db)
    return {
        "risk_analysis": detect_anomalies(transactions),
    }


@router.get("/health-score")
def get_health_score(db: Session = Depends(get_db)):
    # Purpose: return the financial health score summary for the top dashboard card.
    # Request flow: React stores this response in state and passes it as props.
    # Database interaction: spending and risk data are calculated from transactions.
    transactions = get_all_transactions(db)
    total_spending = sum(transaction.amount for transaction in transactions)
    category_spending = calculate_category_spending(transactions)
    risk_transactions = detect_risk_transactions(transactions)
    savings_estimate = estimate_savings(total_spending)

    return calculate_health_score(
        total_spending,
        category_spending,
        risk_transactions,
        savings_estimate,
    )


@router.get("/insights")
def get_insights(db: Session = Depends(get_db)):
    # Purpose: return rule-based financial insights for the dashboard.
    # Request flow: React calls this endpoint and displays each insight as a list item.
    # Database interaction: transactions power spending, risk, and health summaries.
    transactions = get_all_transactions(db)
    total_spending = sum(transaction.amount for transaction in transactions)
    category_spending = calculate_category_spending(transactions)
    monthly_spending = calculate_monthly_spending(transactions)
    risk_transactions = detect_risk_transactions(transactions)
    health_score = calculate_health_score(
        total_spending,
        category_spending,
        risk_transactions,
        estimate_savings(total_spending),
    )

    month_values = [
        month_data["total_spending"]
        for month_data in monthly_spending.values()
    ]
    insight_monthly_spending = {
        "previous_month": month_values[-2] if len(month_values) >= 2 else 0,
        "current_month": month_values[-1] if month_values else 0,
    }

    return generate_insights(
        total_spending,
        category_spending,
        insight_monthly_spending,
        risk_transactions,
        health_score,
    )
