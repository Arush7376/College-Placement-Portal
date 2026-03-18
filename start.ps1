# Start Backend
Write-Host "Starting Backend..." -ForegroundColor Green
Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", "cd backend; python manage.py runserver 8000"

# Start Frontend
Write-Host "Starting Frontend..." -ForegroundColor Green
npm run dev
