# Test if images are loading with fixed paths
Write-Host "Testing image loading with corrected paths..." -ForegroundColor Cyan
Write-Host ""

$testZones = @(
    @{id="ceremonial-infrastructure"; name="Ceremonial Infrastructure"},
    @{id="tropical-dome-greenhouse"; name="Tropical Dome Greenhouse"},
    @{id="agricultural-hub"; name="Agricultural Hub"},
    @{id="main-residence"; name="Main Residence"}
)

foreach ($zone in $testZones) {
    Write-Host "Testing: $($zone.name)" -ForegroundColor Yellow
    
    foreach ($category in @("current", "vision")) {
        try {
            $url = "http://localhost:5001/api/images/$($zone.id)/$category"
            $response = Invoke-WebRequest -Uri $url -UseBasicParsing
            $json = $response.Content | ConvertFrom-Json
            
            if ($json.images -and $json.images.Count -gt 0) {
                Write-Host "  $category : $($json.images.Count) images found" -ForegroundColor Green
                Write-Host "    First image: $($json.images[0].Substring(0, [Math]::Min(80, $json.images[0].Length)))..." -ForegroundColor Gray
            } else {
                Write-Host "  $category : No images" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "  $category : Error - $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    Write-Host ""
}

Write-Host "Open browser to test visually:" -ForegroundColor Cyan
Write-Host "http://localhost:5001" -ForegroundColor White
Write-Host ""
