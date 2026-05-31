from backend.ml.category_predictor import predict_category


def test_expense_categorization_predictions():
    # Assertions: known merchants should match their expected categories.
    assert predict_category("Zomato") == "Food"
    assert predict_category("Uber") == "Travel"
    assert predict_category("Amazon") == "Shopping"


def test_expense_categorization_uses_fuzzy_merchant_matching():
    # Fuzzy matching should work when bank descriptions include extra words.
    assert predict_category("RedBus Booking") == "Travel"
    assert predict_category("OYO Hotel Chennai") == "Travel"
    assert predict_category("Swiggy Order #123") == "Food"
    assert predict_category("Amazon Shopping") == "Shopping"
    assert predict_category("Netflix Subscription") == "Entertainment"
    assert predict_category("Amazon Prime Subscription") == "Entertainment"
    assert predict_category("Unknown Merchant") == "Others"
