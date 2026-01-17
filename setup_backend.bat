@echo off
echo [SETUP] Creating Python virtual environment...
python -m venv venv

echo [SETUP] Activating virtual environment...
call venv\Scripts\activate

echo [SETUP] Installing dependencies...
pip install -r backend\requirements.txt

echo [SETUP] Done! You can now run 'run_backend.bat'.
pause
