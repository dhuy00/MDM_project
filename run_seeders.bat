@echo off
echo Starting comprehensive database seeding...
cd /d "%~dp0"
cd backend
node seeders/masterSeeder.js
echo.
echo Seeding completed!
pause
