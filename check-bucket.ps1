# Check Supabase bucket structure
Write-Host "📦 Checking Supabase Bucket Structure..." -ForegroundColor Cyan
Write-Host ""

$supabaseUrl = "https://klokwelpowqixscecakh.supabase.co"
$bucket = "eco-village-images"

# Test bucket root
Write-Host "Testing bucket root..." -ForegroundColor Yellow
$listUrl = "$supabaseUrl/storage/v1/object/list/$bucket"

try {
    $response = Invoke-WebRequest -Uri $listUrl -UseBasicParsing
    $files = $response.Content | ConvertFrom-Json
    
    Write-Host "✅ Bucket accessible!" -ForegroundColor Green
    Write-Host "Found $($files.Count) items in root" -ForegroundColor White
    Write-Host ""
    
    if ($files.Count -gt 0) {
        Write-Host "Folders/Files in bucket root:" -ForegroundColor Cyan
        foreach ($item in $files | Select-Object -First 20) {
            Write-Host "  - $($item.name)" -ForegroundColor White
        }
    } else {
        Write-Host "⚠️  Bucket is EMPTY!" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "You need to upload your image folders to Supabase!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Expected structure:" -ForegroundColor Cyan
        Write-Host "  eco-village-images/" -ForegroundColor White
        Write-Host "  ├── Tropical Dome Greenhouse/" -ForegroundColor White
        Write-Host "  │   ├── Current/" -ForegroundColor White
        Write-Host "  │   └── Vision/" -ForegroundColor White
        Write-Host "  ├── Agricultural Hub/" -ForegroundColor White
        Write-Host "  │   ├── Current/" -ForegroundColor White
        Write-Host "  │   └── Vision/" -ForegroundColor White
        Write-Host "  └── ...etc" -ForegroundColor White
    }
    
} catch {
    Write-Host "Error accessing bucket: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible issues:" -ForegroundColor Yellow
    Write-Host "  - Bucket does not exist" -ForegroundColor White
    Write-Host "  - Bucket name is wrong" -ForegroundColor White
    Write-Host "  - Bucket is not public" -ForegroundColor White
}

Write-Host ""
Write-Host "🔗 Check your bucket in Supabase Dashboard:" -ForegroundColor Cyan
Write-Host "   https://supabase.com/dashboard/project/klokwelpowqixscecakh/storage/buckets" -ForegroundColor White
Write-Host ""
