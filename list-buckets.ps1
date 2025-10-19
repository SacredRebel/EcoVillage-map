# List all Supabase buckets
Write-Host "Checking Supabase Buckets..." -ForegroundColor Cyan
Write-Host ""

$supabaseUrl = "https://klokwelpowqixscecakh.supabase.co"
$anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsb2t3ZWxwb3dxaXhzY2VjYWtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MzIzMTAsImV4cCI6MjA3NjIwODMxMH0.OtQJmxvy6kXIJFyITAU7DfZYXge4DON9SgVK5Ygye5w"

$headers = @{
    "apikey" = $anonKey
    "Authorization" = "Bearer $anonKey"
}

# List all buckets
$bucketsUrl = "$supabaseUrl/storage/v1/bucket"

try {
    Write-Host "Fetching bucket list..." -ForegroundColor Yellow
    $buckets = Invoke-RestMethod -Uri $bucketsUrl -Headers $headers -Method Get
    
    Write-Host ""
    Write-Host "AVAILABLE BUCKETS:" -ForegroundColor Green
    Write-Host "==================" -ForegroundColor Gray
    
    foreach ($bucket in $buckets) {
        Write-Host ""
        Write-Host "Bucket: $($bucket.name)" -ForegroundColor Cyan
        Write-Host "  ID: $($bucket.id)" -ForegroundColor Gray
        Write-Host "  Public: $($bucket.public)" -ForegroundColor $(if ($bucket.public) { "Green" } else { "Red" })
        Write-Host "  Created: $($bucket.created_at)" -ForegroundColor Gray
        
        # Try to list files in this bucket
        Write-Host "  Checking contents..." -ForegroundColor Yellow
        $listUrl = "$supabaseUrl/storage/v1/object/list/$($bucket.name)"
        
        try {
            $items = Invoke-RestMethod -Uri $listUrl -Headers $headers -Method Get
            Write-Host "  Items in root: $($items.Count)" -ForegroundColor White
            
            if ($items.Count -gt 0) {
                Write-Host "  First 10 items:" -ForegroundColor Gray
                foreach ($item in ($items | Select-Object -First 10)) {
                    $type = if ($item.id) { "FILE" } else { "FOLDER" }
                    Write-Host "    [$type] $($item.name)" -ForegroundColor White
                }
            }
        } catch {
            Write-Host "  Error listing contents: $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    
    Write-Host ""
    Write-Host "Total buckets found: $($buckets.Count)" -ForegroundColor Green
    
} catch {
    Write-Host "Error fetching buckets: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "Response details:" -ForegroundColor Yellow
    Write-Host $_.Exception
}

Write-Host ""
