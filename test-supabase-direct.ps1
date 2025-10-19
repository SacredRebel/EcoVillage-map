# Test direct Supabase access to understand folder structure
$supabaseUrl = "https://klokwelpowqixscecakh.supabase.co"
$anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsb2t3ZWxwb3dxaXhzY2VjYWtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MzIzMTAsImV4cCI6MjA3NjIwODMxMH0.OtQJmxvy6kXIJFyITAU7DfZYXge4DON9SgVK5Ygye5w"
$bucket = "eco-village-images"

$headers = @{
    "apikey" = $anonKey
    "Authorization" = "Bearer $anonKey"
}

Write-Host "Testing Supabase folder structure..." -ForegroundColor Cyan
Write-Host ""

# Test 1: List root of bucket
Write-Host "1. Listing bucket root:" -ForegroundColor Yellow
$url1 = "$supabaseUrl/storage/v1/object/list/$bucket"
try {
    $response = Invoke-RestMethod -Uri $url1 -Headers $headers
    Write-Host "   Found $($response.Count) items" -ForegroundColor Green
    $response | Select-Object -First 10 | ForEach-Object {
        Write-Host "   - $($_.name)" -ForegroundColor White
    }
} catch {
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: List images folder
Write-Host "2. Listing 'images' folder:" -ForegroundColor Yellow
$url2 = "$supabaseUrl/storage/v1/object/list/$bucket?prefix=images"
try {
    $response = Invoke-RestMethod -Uri $url2 -Headers $headers
    Write-Host "   Found $($response.Count) items" -ForegroundColor Green
    $response | Select-Object -First 10 | ForEach-Object {
        Write-Host "   - $($_.name)" -ForegroundColor White
    }
} catch {
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: List Ceremonial Infrastructure/vision
Write-Host "3. Listing 'images/Ceremonial Infrastructure/vision':" -ForegroundColor Yellow
$url3 = "$supabaseUrl/storage/v1/object/list/$bucket?prefix=" + [uri]::EscapeDataString("images/Ceremonial Infrastructure/vision")
try {
    $response = Invoke-RestMethod -Uri $url3 -Headers $headers
    Write-Host "   Found $($response.Count) items" -ForegroundColor Green
    $response | Select-Object -First 5 | ForEach-Object {
        Write-Host "   - $($_.name)" -ForegroundColor White
    }
} catch {
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Try the exact URL you provided
Write-Host "4. Testing your provided URL:" -ForegroundColor Yellow
$testImage = "https://klokwelpowqixscecakh.supabase.co/storage/v1/object/public/eco-village-images/images/Ceremonial%20Infrastructure/vision/ceremonie%20space.jpg"
Write-Host "   $testImage" -ForegroundColor Gray
try {
    $imageResponse = Invoke-WebRequest -Uri $testImage -Method Head
    Write-Host "   Image exists! Status: $($imageResponse.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""
