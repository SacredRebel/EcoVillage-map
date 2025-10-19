# Quick Supabase Setup Script
# This script will help you configure Supabase credentials

Write-Host "🔧 Supabase Configuration Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env already exists
if (Test-Path ".env") {
    Write-Host "⚠️  .env file already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/n)"
    if ($overwrite -ne "y") {
        Write-Host "❌ Setup cancelled" -ForegroundColor Red
        exit
    }
}

Write-Host ""
Write-Host "📝 Please provide your Supabase credentials" -ForegroundColor Green
Write-Host "   (Find these in your Supabase Dashboard > Project Settings > API)" -ForegroundColor Gray
Write-Host ""

# Get Supabase URL
$supabaseUrl = Read-Host "Enter your Supabase Project URL (e.g., https://xxxxx.supabase.co)"

# Validate URL
if (-not ($supabaseUrl -match "^https://.*\.supabase\.co$")) {
    Write-Host "❌ Invalid URL format. Should be: https://your-project.supabase.co" -ForegroundColor Red
    exit
}

Write-Host "✅ URL looks good!" -ForegroundColor Green
Write-Host ""

# Get Supabase Anon Key
Write-Host "Enter your Supabase anon/public key" -ForegroundColor Cyan
Write-Host "(It's a long string starting with 'eyJ...')" -ForegroundColor Gray
$supabaseKey = Read-Host "Anon Key"

# Validate key
if (-not ($supabaseKey -match "^eyJ")) {
    Write-Host "⚠️  Warning: Key doesn't start with 'eyJ' - this might not be correct" -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        Write-Host "❌ Setup cancelled" -ForegroundColor Red
        exit
    }
}

Write-Host "✅ Key received!" -ForegroundColor Green
Write-Host ""

# Get bucket name (default: eco-village-images)
$bucketName = Read-Host "Enter bucket name (press Enter for default: eco-village-images)"
if ([string]::IsNullOrWhiteSpace($bucketName)) {
    $bucketName = "eco-village-images"
}

Write-Host ""
Write-Host "📝 Creating .env file..." -ForegroundColor Cyan

# Create .env file
$envContent = @"
# Supabase Configuration
# Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

SUPABASE_URL=$supabaseUrl
SUPABASE_ANON_KEY=$supabaseKey
SUPABASE_BUCKET=$bucketName
"@

$envContent | Out-File -FilePath ".env" -Encoding utf8 -Force

Write-Host "✅ .env file created successfully!" -ForegroundColor Green
Write-Host ""

# Install dotenv if not present
Write-Host "📦 Checking for dotenv package..." -ForegroundColor Cyan
$packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json

if (-not ($packageJson.dependencies.PSObject.Properties.Name -contains "dotenv")) {
    Write-Host "📦 Installing dotenv package..." -ForegroundColor Yellow
    npm install dotenv
    Write-Host "✅ dotenv installed!" -ForegroundColor Green
} else {
    Write-Host "✅ dotenv already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔄 Restarting server..." -ForegroundColor Cyan

# Kill existing Node processes
try {
    Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force
    Write-Host "✅ Stopped existing server" -ForegroundColor Green
} catch {
    Write-Host "ℹ️  No existing server to stop" -ForegroundColor Gray
}

Write-Host ""
Write-Host "🚀 Starting server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "═════════════════════════════════════════" -ForegroundColor Green
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "═════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Configuration Summary:" -ForegroundColor Cyan
Write-Host "   URL: $supabaseUrl" -ForegroundColor White
Write-Host "   Bucket: $bucketName" -ForegroundColor White
Write-Host "   Key: $($supabaseKey.Substring(0, 20))..." -ForegroundColor White
Write-Host ""
Write-Host "🌐 Server should be running at: http://localhost:5001" -ForegroundColor Cyan
Write-Host ""
Write-Host "🧪 Test your setup:" -ForegroundColor Yellow
Write-Host "   1. Open: http://localhost:5001" -ForegroundColor White
Write-Host "   2. Click any zone icon (🌴, 🎪, 🏠, etc.)" -ForegroundColor White
Write-Host "   3. Images should load in Current/Vision tabs" -ForegroundColor White
Write-Host ""
Write-Host "🐛 If images still don't load, check:" -ForegroundColor Yellow
Write-Host "   • Supabase bucket is named '$bucketName'" -ForegroundColor White
Write-Host "   • Bucket is set to PUBLIC" -ForegroundColor White
Write-Host "   • Folders are uploaded with correct names" -ForegroundColor White
Write-Host "   • Run: .\fix-folder-names.ps1" -ForegroundColor White
Write-Host ""
Write-Host "📖 For detailed troubleshooting, see: SETUP_SUPABASE.md" -ForegroundColor Gray
Write-Host ""

# Open browser
$openBrowser = Read-Host "Open browser to test? (y/n)"
if ($openBrowser -eq "y") {
    Start-Process "http://localhost:5001"
}

Write-Host ""
Write-Host "✨ All done! Happy coding!" -ForegroundColor Green
