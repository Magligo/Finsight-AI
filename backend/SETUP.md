# FinSight AI Backend Environment Setup

## Purpose

This guide explains how to create and activate a Python virtual environment for the FinSight AI FastAPI backend.

## Create Virtual Environment

Run this command from the project root:

```powershell
python -m venv backend\.venv
```

## Activate Virtual Environment

Run this command in PowerShell:

```powershell
backend\.venv\Scripts\Activate.ps1
```

## Install Dependencies

After activating the virtual environment, install the backend dependencies:

```powershell
pip install -r backend\requirements.txt
```

## Run FastAPI App

Start the backend development server:

```powershell
uvicorn backend.app.main:app --reload
```

## Verify Setup

Open this URL in a browser:

```text
http://127.0.0.1:8000/
```

Expected JSON response:

```json
{
  "project": "FinSight AI",
  "status": "Running"
}
```
