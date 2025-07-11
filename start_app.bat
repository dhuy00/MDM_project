@echo off
echo Starting Shopee Project...

REM Starting the backend server
echo Starting backend server...
cd backend
start cmd /k "npm start"

REM Wait a bit to ensure backend is up before starting frontend
timeout /t 5 /nobreak

REM Starting the frontend
echo Starting frontend...
cd ../shopee-project
start cmd /k "npm start"

echo Both servers are starting up...
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul
