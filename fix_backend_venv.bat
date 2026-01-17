@echo off
echo [FIX] Recreating virtual environment...

:: Remove corrupted venv
if exist backend\.venv (
    echo [FIX] Removing corrupted virtual environment...
    rmdir /s /q backend\.venv
)

:: Create fresh venv
echo [FIX] Creating fresh virtual environment...
python -m venv backend\.venv

:: Activate it
echo [FIX] Activating virtual environment...
call backend\.venv\Scripts\activate

:: Install dependencies
echo [FIX] Installing dependencies...
cd backend
python -m pip install --upgrade pip
python -m pip install -r requirements.txt

echo.
echo [SUCCESS] Virtual environment has been recreated!
echo [SUCCESS] You can now run: run_backend.bat
echo.
pause
