from backend.app.services.ml_risk_detection import detect_anomalies


def test_isolation_forest_marks_large_transaction_high_risk():
    transactions = [
        {"merchant": "Store A", "amount": 100},
        {"merchant": "Store B", "amount": 150},
        {"merchant": "Store C", "amount": 120},
        {"merchant": "Store D", "amount": 180},
        {"merchant": "Store E", "amount": 130},
        {"merchant": "Netflix", "amount": 15000},
    ]

    results = detect_anomalies(transactions)
    risk_by_amount = {
        result["amount"]: result["risk_status"]
        for result in results
    }

    assert risk_by_amount[15000.0] == "High Risk"
    assert risk_by_amount[100.0] == "Normal"
    assert risk_by_amount[150.0] == "Normal"
    assert risk_by_amount[120.0] == "Normal"
    assert risk_by_amount[180.0] == "Normal"
    assert risk_by_amount[130.0] == "Normal"
