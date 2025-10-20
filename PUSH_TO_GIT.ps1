# EcoVillage Map - Push to Git and Deploy
# Run this script to commit and push all changes

Write-Host "🚀 EcoVillage Map - Git Push Script" -ForegroundColor Cyan
Write-Host ""

# Check git status
Write-Host "📊 Checking git status..." -ForegroundColor Yellow
git status
Write-Host ""

# Confirm with user
Write-Host "⚠️  WARNING: Your branch has diverged from origin/main" -ForegroundColor Red
Write-Host "You have 21 local commits and 1 remote commit." -ForegroundColor Yellow
Write-Host ""
Write-Host "Options:" -ForegroundColor Cyan
Write-Host "1. Pull and merge (git pull origin main --rebase)" -ForegroundColor White
Write-Host "2. Force push (git push origin main --force)" -ForegroundColor White
Write-Host "3. Cancel" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-3)"

if ($choice -eq "3") {
    Write-Host "❌ Cancelled" -ForegroundColor Red
    exit
}

# Add all changes
Write-Host ""
Write-Host "📦 Adding all changes..." -ForegroundColor Green
git add .

# Commit with detailed message
Write-Host ""
Write-Host "💾 Creating commit..." -ForegroundColor Green
git commit -m "feat: Subcategories + Performance Optimizations

✨ Features:
- 4 zones with subcategories (Infrastructure, Main Residence, Retreat Village, Gate Lodge)
- 112 vision images organized across 12 subcategories
- Dynamic subcategory tab rendering

⚡ Performance:
- Added compression middleware (70-80% smaller payloads)
- Added CORS for cross-origin compatibility
- 1-year cache for image API (instant loads)
- All images via Supabase CDN

🚀 Deployment:
- Server optimized for Vercel serverless
- Complete deployment documentation
- Vercel configuration optimized"

# Push based on choice
Write-Host ""
if ($choice -eq "1") {
    Write-Host "🔄 Pulling and rebasing..." -ForegroundColor Cyan
    git pull origin main --rebase
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Rebase failed! Resolve conflicts and run: git push origin main" -ForegroundColor Red
        exit
    }
    Write-Host "⬆️  Pushing to origin/main..." -ForegroundColor Cyan
    git push origin main
} elseif ($choice -eq "2") {
    Write-Host "⚠️  Force pushing to origin/main..." -ForegroundColor Yellow
    git push origin main --force
}

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Push successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Vercel will auto-deploy (if connected to GitHub)" -ForegroundColor White
    Write-Host "2. Or deploy manually: vercel --prod" -ForegroundColor White
    Write-Host "3. Test your production URL" -ForegroundColor White
    Write-Host ""
    Write-Host "📚 Read VERCEL_DEPLOYMENT.md for complete deployment guide" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "❌ Push failed!" -ForegroundColor Red
    Write-Host "Check the error above and try again" -ForegroundColor Yellow
}
