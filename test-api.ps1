# Test Supabase API connection
Write-Host "🧪 Testing Supabase Image API..." -ForegroundColor Cyan
Write-Host ""

$testZones = @(
    "tropical-dome-greenhouse",
    "agricultural-hub",
    "events-gatherings-hub",
    "main-residence"
)

foreach ($zone in $testZones) {
    Write-Host "Testing: $zone" -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5001/api/images/$zone/current" -UseBasicParsing
        $json = $response.Content | ConvertFrom-Json
        
        if ($json.success) {
            if ($json.images.Count -gt 0) {
                Write-Host "  ✅ SUCCESS - $($json.images.Count) images found" -ForegroundColor Green
            } else {
                Write-Host "  ⚠️  Connected but NO IMAGES in folder" -ForegroundColor Yellow
            }
        } else {
            Write-Host "  ❌ API returned error" -ForegroundColor Red
        }
    } catch {
        Write-Host "  ❌ Failed to connect: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host ""
Write-Host "🌐 Open browser to test visually:" -ForegroundColor Cyan
Write-Host "   http://localhost:5001" -ForegroundColor White
Write-Host ""
