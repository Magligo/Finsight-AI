from backend.app.services.financial_health_score import calculate_health_score


def test_health_score_range():
    # Test execution: calculate a score using beginner-friendly sample inputs.
    result = calculate_health_score(
        total_spending=15000,
        category_spending={"Food": 5000, "Travel": 3000, "Shopping": 7000},
        risk_transactions=[],
        savings_estimate=8000,
    )

    # Assertion: health score should always stay between 0 and 100.
    assert 0 <= result["health_score"] <= 100

    # Expected behavior: grade should be one of the supported labels.
    assert result["grade"] in ["Excellent", "Good", "Average", "Poor"]
