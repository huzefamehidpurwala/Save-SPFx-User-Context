Clear-Host

# --- Script Configuration ---
# Replace these placeholder values with your actual deployment credentials and web app name.
$userName = '$subs'  # e.g., $my-app
$password = 'RqF6RaGsQhzZd1u7aoZ98miYQs8Y9zjdmlLWhe2bjo0wA3T7tZr5tjrvd9SF'  # A password, not a PAT
$webserverName = 'subs-bha8hededwhnd3ce.scm.centralindia-01.azurewebsites.net:443'     # e.g., my-app

# --- Script Variables (no changes needed below) ---
$deploymentFolder = ".\.deployment"
$zipFilePath = "$deploymentFolder\deployment.zip"
$kuduApiUrl = "https://{0}/api/zipdeploy" -f $webserverName


# --- 1. Create Deployment Package ---
# Creates a zip archive of the current directory, excluding files listed in .appserviceignore

# Ensure the .deployment directory exists
if (-not (Test-Path ".\.deployment")) {
  New-Item -ItemType Directory -Path ".\.deployment" | Out-Null
}

# Define arguments for 7-Zip for better readability and to avoid quoting issues.
$7zArgs = @(
  "a", # Add to archive command
  "-tzip", # Set archive type to ZIP
  $zipFilePath, # Output file path
  ".\*", # Source: all files/folders in current dir
  "-xr@.appserviceignore"                 # Exclude files listed in .appserviceignore
)

Write-Host "Creating deployment package at $zipFilePath..."
# Use the call operator '&' to execute the command. Assumes 7z.exe is in your PATH.
& "7z.exe" $7zArgs

if ($LASTEXITCODE -ne 0) {
  Write-Error "7-Zip failed to create the archive. Exit code: $LASTEXITCODE"
  exit 1 # Exit the script if zipping fails
}


# --- 2. Deploy to Azure ---
# Uploads the zip file to the Kudu zipdeploy API using curl.exe

# Define arguments for curl.exe
$curlArgs = @(
  "-X", "POST",
  "-u", "$($userName):$($password)", # Basic authentication
  "--data-binary", "@$zipFilePath", # POST the file content
  $kuduApiUrl
)

Write-Host "Deploying to Azure App Service: $webserverName..."
# Use curl.exe to avoid the PowerShell alias.
& "curl.exe" $curlArgs

if ($LASTEXITCODE -ne 0) {
  Write-Error "Curl deployment failed. Exit code: $LASTEXITCODE"
  exit 1 # Exit the script if deployment fails
}

Write-Host "Deployment completed successfully."

# --- CLEANUP STEP ---
# This code only runs if the Invoke-RestMethod command above was successful.
Write-Host "Cleaning up deployment artifacts..."
Remove-Item -Path $deploymentFolder -Recurse -Force
Write-Host "Cleanup complete. Removed '$deploymentFolder' folder."