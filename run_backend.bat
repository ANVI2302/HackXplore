@echo off
echo [INFO] Starting Backend Server...

:: Navigate to backend directory first
cd backend

:: Check for venv and activate
if exist .venv\Scripts\activate (
    echo [INFO] Activating virtual environment...
    call .venv\Scripts\activate
) else if exist ..\venv\Scripts\activate (
    echo [INFO] Activating virtual environment...
    call ..\venv\Scripts\activate
) else (
    echo [ERROR] No virtual environment found. Please run setup_backend.bat first.
    pause
    exit /b 1
)

:: Ensure uvicorn is installed in the venv
python -m uvicorn --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Uvicorn not found in venv. Installing dependencies...
    python -m pip install -r requirements.txt
)

echo [INFO] Server running at http://localhost:8000
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
