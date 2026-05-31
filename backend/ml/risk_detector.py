import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest


def detect_anomalies(transaction_data=None):
    # Prediction Flow: load transaction amounts that should be checked for risk.
    # This sample data can later be replaced with real transactions from SQLite.
    if transaction_data is None:
        transaction_data = [
            {"transaction_id": 1, "amount": 1200},
            {"transaction_id": 2, "amount": 450},
            {"transaction_id": 3, "amount": 899},
            {"transaction_id": 4, "amount": 1500},
            {"transaction_id": 5, "amount": 700},
            {"transaction_id": 15, "amount": 50000},
        ]

    transactions = pd.DataFrame(transaction_data)

    # Isolation Forest expects numerical input, so transaction amounts are reshaped
    # into a two-dimensional NumPy array.
    amount_values = np.array(transactions["amount"]).reshape(-1, 1)

    # Isolation Forest: learns what normal transaction amounts look like and marks
    # unusual amounts as anomalies.
    model = IsolationForest(
        contamination=0.15,
        random_state=42,
    )

    # Anomaly Detection: train the model and predict whether each amount is normal
    # or unusual. Isolation Forest returns -1 for anomalies and 1 for normal values.
    transactions["anomaly"] = model.fit_predict(amount_values)

    # Risk Scoring: label unusual transactions as High risk for beginner-friendly output.
    anomaly_transactions = transactions[transactions["anomaly"] == -1]

    # Prediction Flow: return only the fields the application needs to display risk.
    results = []
    for _, transaction in anomaly_transactions.iterrows():
        results.append(
            {
                "transaction_id": int(transaction["transaction_id"]),
                "amount": float(transaction["amount"]),
                "risk": "High",
            }
        )

    return results


if __name__ == "__main__":
    print(detect_anomalies())
