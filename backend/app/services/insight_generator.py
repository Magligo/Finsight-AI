def generate_insights(
    total_spending,
    category_spending,
    monthly_spending,
    risk_detection_results,
    financial_health_score,
):
    insights = []

    # Rule-based insight generation: find the category with the highest spending.
    if category_spending:
        highest_category = max(category_spending, key=category_spending.get)
        insights.append(f"{highest_category} is your highest spending category.")

    # Percentage calculations: compare current month spending with previous month.
    current_month_spending = monthly_spending.get("current_month", 0)
    previous_month_spending = monthly_spending.get("previous_month", 0)

    if previous_month_spending > 0:
        spending_change = (
            (current_month_spending - previous_month_spending)
            / previous_month_spending
        ) * 100

        if spending_change > 0:
            insights.append(
                f"Your spending increased by {round(spending_change)}% this month."
            )
        elif spending_change < 0:
            insights.append(
                f"Your spending decreased by {abs(round(spending_change))}% this month."
            )
        else:
            insights.append("Your spending stayed the same this month.")
    elif current_month_spending > 0:
        insights.append("This is the first month of spending data available.")

    # Rule-based insight generation: report high-risk transactions when detected.
    risk_count = len(risk_detection_results)
    if risk_count == 1:
        insights.append("One high-risk transaction was detected.")
    elif risk_count > 1:
        insights.append(f"{risk_count} high-risk transactions were detected.")
    else:
        insights.append("No high-risk transactions were detected.")

    # Rule-based insight generation: summarize the financial health score grade.
    health_grade = financial_health_score.get("grade", "Unknown")
    insights.append(f"Your financial health score is {health_grade}.")

    # Recommendation logic: suggest savings behavior based on spending and grade.
    if health_grade in ["Average", "Poor"]:
        insights.append("Consider reducing non-essential spending to improve savings.")
    elif total_spending > 0 and category_spending:
        highest_category_amount = max(category_spending.values())
        if highest_category_amount / total_spending > 0.50:
            insights.append("Try setting a monthly limit for your top spending category.")
        else:
            insights.append("Your spending is fairly balanced. Keep tracking your savings.")
    else:
        insights.append("Add more transaction data to receive better savings recommendations.")

    return {
        "insights": insights,
    }
