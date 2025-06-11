Clear-Host

# Create Azurite directory if it doesn't exist
if (-not (Test-Path ".azurite")) {
    New-Item -ItemType Directory -Path ".azurite" | Out-Null
}

# Kill any existing Azurite processes
Get-Process | Where-Object {$_.ProcessName -like "azurite*"} | Stop-Process -Force

$azuriteJob = Start-Job -ScriptBlock {
    Set-Location "E:\vs_code\subscription-checker"
    npm run azurite
}

Write-Host "Starting Azurite..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Set environment variables for local development
$env:NODE_ENV = "development"

# Start the application
Write-Host "Starting application..." -ForegroundColor Green
npm run start

# Cleanup when the script is interrupted
finally {
    Stop-Job $azuriteJob
    Remove-Job $azuriteJob
}
