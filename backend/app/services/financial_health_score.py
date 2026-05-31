def calculate_health_score(
    total_spending,
    category_spending,
    risk_transactions,
    savings_estimate,
):
    # Weightage system: the final score is calculated out of 100 points.
    # Spending Score contributes 40 points.
    # Risk Score contributes 30 points.
    # Category Balance Score contributes 20 points.
    # Savings Score contributes 10 points.

    # Scoring logic: lower total spending receives a better spending score.
    if total_spending <= 10000:
        spending_score = 40
    elif total_spending <= 25000:
        spending_score = 30
    elif total_spending <= 50000:
        spending_score = 20
    else:
        spending_score = 10

    # Scoring logic: fewer risky transactions means a higher risk score.
    risk_count = len(risk_transactions)
    if risk_count == 0:
        risk_score = 30
    elif risk_count <= 2:
        risk_score = 20
    elif risk_count <= 5:
        risk_score = 10
    else:
        risk_score = 0

    # Scoring logic: balanced spending across categories receives a better score.
    if not category_spending or total_spending <= 0:
        category_balance_score = 0
    else:
        highest_category_spending = max(category_spending.values())
        highest_category_ratio = highest_category_spending / total_spending

        if highest_category_ratio <= 0.40:
            category_balance_score = 20
        elif highest_category_ratio <= 0.60:
            category_balance_score = 15
        elif highest_category_ratio <= 0.80:
            category_balance_score = 10
        else:
            category_balance_score = 5

    # Scoring logic: higher estimated savings receives a better savings score.
    if savings_estimate >= 10000:
        savings_score = 10
    elif savings_estimate >= 5000:
        savings_score = 7
    elif savings_estimate >= 1000:
        savings_score = 4
    else:
        savings_score = 0

    health_score = (
        spending_score
        + risk_score
        + category_balance_score
        + savings_score
    )

    # Grade calculation: convert the numeric health score into a simple grade.
    if health_score >= 90:
        grade = "Excellent"
    elif health_score >= 75:
        grade = "Good"
    elif health_score >= 50:
        grade = "Average"
    else:
        grade = "Poor"

    return {
        "health_score": health_score,
        "grade": grade,
    }
