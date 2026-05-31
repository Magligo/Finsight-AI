from backend.ml.risk_detector import detect_anomalies


def test_normal_transaction_should_not_be_anomaly():
    transactions = [
        {"transaction_id": 1, "amount": 100},
        {"transaction_id": 2, "amount": 120},
        {"transaction_id": 3, "amount": 90},
        {"transaction_id": 4, "amount": 110},
        {"transaction_id": 5, "amount": 50000},
    ]

    # Test execution: run anomaly detection on sample transaction amounts.
    anomalies = detect_anomalies(transactions)
    anomaly_ids = [anomaly["transaction_id"] for anomaly in anomalies]

    # Assertion: a normal transaction should not be marked as risky.
    assert 1 not in anomaly_ids


def test_large_transaction_should_be_anomaly():
    transactions = [
        {"transaction_id": 1, "amount": 100},
        {"transaction_id": 2, "amount": 120},
        {"transaction_id": 3, "amount": 90},
        {"transaction_id": 4, "amount": 110},
        {"transaction_id": 5, "amount": 50000},
    ]

    # Test execution: run anomaly detection on data with one very large amount.
    anomalies = detect_anomalies(transactions)
    anomaly_ids = [anomaly["transaction_id"] for anomaly in anomalies]

    # Expected behavior: the large transaction should be detected as High risk.
    assert 5 in anomaly_ids
