Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "   React Native & Android Environment Check   " -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan

# 1. Check JAVA_HOME & Java Version
Write-Host "`n[1] Java Development Kit (JDK 17 Required)" -ForegroundColor Yellow
Write-Host "JAVA_HOME: $env:JAVA_HOME"
if ($env:JAVA_HOME -and (Test-Path $env:JAVA_HOME)) {
    Write-Host "Status: Directory exists." -ForegroundColor Green
} else {
    Write-Host "Status: NOT SET or directory missing!" -ForegroundColor Red
}
try {
    java -version
} catch {
    Write-Host "Java command not found in PATH." -ForegroundColor Red
}

# 2. Check ANDROID_HOME & SDK Path
Write-Host "`n[2] Android SDK" -ForegroundColor Yellow
Write-Host "ANDROID_HOME: $env:ANDROID_HOME"
if ($env:ANDROID_HOME -and (Test-Path $env:ANDROID_HOME)) {
    Write-Host "Status: Directory exists." -ForegroundColor Green
} else {
    Write-Host "Status: NOT SET or directory missing!" -ForegroundColor Red
}

# 3. Check Node.js and npm
Write-Host "`n[3] Node.js & npm" -ForegroundColor Yellow
try {
    node -v
    npm -v
    Write-Host "Status: Node and npm are available." -ForegroundColor Green
} catch {
    Write-Host "Node.js or npm not found in PATH." -ForegroundColor Red
}

Write-Host "`n==============================================" -ForegroundColor Cyan