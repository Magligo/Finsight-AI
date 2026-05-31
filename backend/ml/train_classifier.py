import pickle
import re
from pathlib import Path

import nltk
import pandas as pd
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline


BASE_DIR = Path(__file__).resolve().parent
DATASET_PATH = BASE_DIR / "training_data.csv"
MODEL_PATH = BASE_DIR / "expense_category_model.pkl"


def get_stop_words():
    # NLP preprocessing: stop words are common words that usually add little meaning.
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
    # NLP preprocessing: lowercase text so "Uber" and "uber" are treated the same.
    text = text.lower()

    # NLP preprocessing: remove numbers and punctuation, keeping only letters and spaces.
    text = re.sub(r"[^a-z\s]", " ", text)

    # NLP preprocessing: remove common words and extra spaces.
    words = [word for word in text.split() if word not in STOP_WORDS]
    return " ".join(words)


def train_classifier():
    # Load dataset using Pandas from the local CSV file.
    data = pd.read_csv(DATASET_PATH)

    # Clean transaction descriptions before they are converted into features.
    descriptions = data["description"].apply(clean_text)
    categories = data["category"]

    # TF-IDF converts text into numerical features that the classifier can learn from.
    # Naive Bayes is a simple, beginner-friendly classifier for text categories.
    model = Pipeline(
        steps=[
            ("tfidf", TfidfVectorizer()),
            ("classifier", MultinomialNB()),
        ]
    )

    # Model training: learn the relationship between descriptions and categories.
    model.fit(descriptions, categories)

    # Save the trained model with pickle so it can be loaded later for prediction.
    with MODEL_PATH.open("wb") as model_file:
        pickle.dump(model, model_file)

    print(f"Model trained and saved to {MODEL_PATH}")


if __name__ == "__main__":
    train_classifier()
