import pandas as pd
from sklearn.ensemble import IsolationForest


def _transaction_value(transaction, field_name, default=None):
    if isinstance(transaction, dict):
        return transaction.get(field_name, default)

    return getattr(transaction, field_name, default)


def detect_anomalies(transactions):
    # IsolationForest is a Scikit-learn anomaly detection algorithm.
    # It learns the normal range of transaction amounts and separates values
    # that look very different from the rest of the user's spending history.
    #
    # Anomaly detection is useful in finance because fraud and unusual spending
    # often stand out from a person's normal behavior. For example, if most
    # transactions are around 100-200 and one transaction is 15000, the model can
    # flag that transaction for review.
    #
    # This beginner-friendly version only uses the amount column. More advanced
    # systems can also use merchant, category, location, time of day, and device.
    if not transactions:
        return []

    transaction_rows = [
        {
            "merchant": _transaction_value(
                transaction,
                "description",
                _transaction_value(transaction, "merchant", "Unknown"),
            ),
            "amount": float(_transaction_value(transaction, "amount", 0) or 0),
        }
        for transaction in transactions
    ]

    transaction_data = pd.DataFrame(transaction_rows)

    if len(transaction_data) < 3:
        transaction_data["risk_status"] = "Normal"
    else:
        amount_frame = transaction_data[["amount"]]
        expected_anomaly_rate = max(1 / len(transaction_data), 0.05)

        model = IsolationForest(
            contamination=min(expected_anomaly_rate, 0.2),
            random_state=42,
        )

        # IsolationForest returns 1 for normal records and -1 for anomalies.
        # Anomalies are marked High Risk so the dashboard can show them clearly.
        transaction_data["prediction"] = model.fit_predict(amount_frame)
        transaction_data["risk_status"] = transaction_data["prediction"].map(
            {1: "Normal", -1: "High Risk"}
        )

    return [
        {
            "merchant": row["merchant"],
            "amount": row["amount"],
            "risk_status": row["risk_status"],
        }
        for _, row in transaction_data.iterrows()
    ]
