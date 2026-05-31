from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


# SQLite database file used by the FinSight AI backend.
DATABASE_URL = "sqlite:///./finsight.db"


# Engine: manages the connection pool and communication with the SQLite database.
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},
)


# Session: creates database session objects for interacting with the database.
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


# Database connection dependency: opens a session and closes it after use.
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
