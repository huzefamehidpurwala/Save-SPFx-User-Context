Clear-Host

# Set environment variables for local development
$env:NODE_ENV = "local" # "production"

# Start the application
Write-Host "Starting application..." -ForegroundColor Green
npm run start

# Cleanup when the script is interrupted
finally {
    Stop-Job $azuriteJob
    Remove-Job $azuriteJob
}
