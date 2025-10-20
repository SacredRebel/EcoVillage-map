# Test Agricultural Hub images
Write-Host "Testing Agricultural Hub Images..." -ForegroundColor Cyan
Write-Host ""

$categories = @("current", "vision")

foreach ($category in $categories) {
    Write-Host "Testing $category..." -ForegroundColor Yellow
    
    try {
        $url = "http://localhost:5001/api/images/agricultural-hub/$category"
        $response = Invoke-WebRequest -Uri $url -UseBasicParsing
        $json = $response.Content | ConvertFrom-Json
        
        if ($json.success -and $json.images.Count -gt 0) {
            Write-Host "  SUCCESS: $($json.images.Count) images loaded" -ForegroundColor Green
            Write-Host "  First image:" -ForegroundColor Gray
            Write-Host "    $($json.images[0])" -ForegroundColor White
        } else {
            Write-Host "  No images found" -ForegroundColor Red
        }
    } catch {
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "Open browser to test visually:" -ForegroundColor Cyan
Write-Host "http://localhost:5001" -ForegroundColor White
Write-Host ""
Write-Host "Then click on the Agricultural Hub zone icon!" -ForegroundColor Yellow
