# FinSight AI Startup Verification Checklist

## Backend

- Open a terminal in `backend/`.
- Install Python dependencies with `pip install -r requirements.txt`.
- Start FastAPI with `uvicorn app.main:app --reload`.
- Verify the backend root URL: `http://127.0.0.1:8000`.
- Verify the API docs URL: `http://127.0.0.1:8000/docs`.

## Frontend

- Open a terminal in `frontend/`.
- Install Node dependencies with `npm install`.
- Start Vite with `npm run dev`.
- Verify the frontend URL: `http://localhost:5173`.

## Integration

- Confirm `frontend/src/services/api.js` uses `http://127.0.0.1:8000`.
- Confirm FastAPI CORS is enabled in `backend/app/main.py`.
- Confirm the dashboard can request transactions, health score, insights, spending analysis, and risk alerts.
