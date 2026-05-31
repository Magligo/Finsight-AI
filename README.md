# FinSight AI

Project architecture scaffold for a FastAPI, React, SQLite, Scikit-learn, NLTK, and Plotly application.

## Folder Purpose Comments

- `backend/`: Backend service root for API, ML, database, and server-side configuration.
- `backend/app/`: FastAPI application package.
- `backend/app/api/`: FastAPI route modules and API endpoint definitions.
- `backend/app/services/`: Business logic and service-layer functions.
- `backend/app/models/`: Data schemas, ORM models, and validation models.
- `backend/app/database/`: SQLite connection setup, migrations, and database helpers.
- `backend/app/utils/`: Shared backend utility functions and reusable helpers.
- `backend/ml/`: Scikit-learn models, training scripts, feature pipelines, and NLTK NLP assets.
- `backend/data/`: Local datasets, SQLite database files, and generated data artifacts.
- `frontend/`: React frontend application root.
- `frontend/public/`: Static frontend assets such as icons, images, and public files.
- `frontend/src/`: React source code root.
- `frontend/src/components/`: Reusable React UI components.
- `frontend/src/pages/`: Top-level React page views and route screens.
- `frontend/src/services/`: Frontend API clients and integration helpers for the backend.
- `frontend/src/charts/`: Plotly chart components and dashboard visualization modules.
- `docs/`: Project documentation, architecture notes, and setup guides.
- `tests/`: Backend, frontend, ML, and integration tests.
