import pickle
import re
from pathlib import Path

import nltk
from nltk.corpus import stopwords


BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "expense_category_model.pkl"


MERCHANT_CATEGORY_MAP = {
    "Food": [
        "swiggy",
        "zomato",
        "dominos",
        "pizza hut",
        "kfc",
        "mcdonalds",
        "burger king",
        "subway",
        "starbucks",
        "cafe coffee day",
    ],
    "Travel": [
        "uber",
        "ola",
        "redbus",
        "abhibus",
        "makemytrip",
        "irctc",
        "goibibo",
        "yatra",
        "indigo",
        "air india",
        "spicejet",
        "vistara",
        "rapido",
        "oyo",
        "treebo",
        "fabhotel",
        "trident",
        "taj",
        "marriott",
        "radisson",
        "holiday inn",
        "booking.com",
        "agoda",
    ],
    "Shopping": [
        "amazon",
        "flipkart",
        "myntra",
        "ajio",
        "meesho",
        "reliance digital",
        "croma",
        "nykaa",
        "tata cliq",
    ],
    "Entertainment": [
        "netflix",
        "spotify",
        "hotstar",
        "amazon prime",
        "sony liv",
        "zee5",
        "youtube premium",
    ],
    "Bills": [
        "electricity",
        "water bill",
        "gas bill",
        "broadband",
        "jio",
        "airtel",
        "bsnl",
        "vi",
    ],
    "Health": [
        "apollo",
        "practo",
        "medplus",
        "1mg",
        "netmeds",
    ],
    "Education": [
        "udemy",
        "coursera",
        "geeksforgeeks",
        "leetcode",
        "unacademy",
        "byjus",
    ],
}


def get_stop_words():
    # NLP preprocessing: use stop words to remove common words before prediction.
    try:
        return set(stopwords.words("english"))
    except LookupError:
        try:
            nltk.download("stopwords", quiet=True)
            return set(stopwords.words("english"))
        except LookupError:
            return {"a", "an", "and", "the", "to", "for", "of", "in"}


STOP_WORDS = get_stop_words()


def clean_text(text):
    # NLP preprocessing: match the same cleaning steps used during model training.
    text = text.lower()
    text = re.sub(r"[^a-z\s]", " ", text)
    words = [word for word in text.split() if word not in STOP_WORDS]
    return " ".join(words)


def normalize_merchant_name(merchant_name):
    # Merchant lookup normalization: lower-case the merchant text and collapse
    # repeated spaces so "  Swiggy   Order " and "swiggy order" match the same
    # keyword rules.
    normalized_text = merchant_name.strip().lower()
    return re.sub(r"\s+", " ", normalized_text)


def load_model():
    if not MODEL_PATH.exists():
        # Prediction flow: train the model from training_data.csv if no saved model exists.
        from ml.train_classifier import train_classifier

        train_classifier()

    # Prediction flow: load the saved pickle model from disk before predicting.
    with MODEL_PATH.open("rb") as model_file:
        return pickle.load(model_file)


def categorize_transaction(merchant_name):
    # Prediction flow: accept a normalized merchant name or transaction description
    # from the application before the row is inserted into SQLite.
    normalized_merchant_name = normalize_merchant_name(merchant_name)

    # Fuzzy merchant matching: many bank descriptions contain extra words such
    # as "RedBus Booking", "OYO Hotel Chennai", or "Swiggy Order #123".
    # Instead of requiring an exact merchant name, check whether any known
    # keyword exists inside the full transaction text.
    keyword_matches = [
        (keyword, category)
        for category, keywords in MERCHANT_CATEGORY_MAP.items()
        for keyword in keywords
        if keyword in normalized_merchant_name
    ]

    if keyword_matches:
        # Specific phrases should win over broad words. For example,
        # "amazon prime" should map to Entertainment before plain "amazon"
        # maps the transaction to Shopping.
        _, matched_category = max(
            keyword_matches,
            key=lambda match: len(match[0]),
        )
        return matched_category

    # Unknown fallback: if no real-world merchant keyword is found, use Others
    # so the dashboard does not show a misleading category.
    return "Others"


def predict_category(description):
    # Backward-compatible wrapper used by existing tests and imports.
    return categorize_transaction(description)


if __name__ == "__main__":
    sample_description = "Uber ride"
    print(predict_category(sample_description))
