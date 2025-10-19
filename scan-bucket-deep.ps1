# Deep scan of Supabase bucket
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SUPABASE BUCKET DEEP SCAN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$supabaseUrl = "https://klokwelpowqixscecakh.supabase.co"
$bucket = "eco-village-images"
$anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsb2t3ZWxwb3dxaXhzY2VjYWtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MzIzMTAsImV4cCI6MjA3NjIwODMxMH0.OtQJmxvy6kXIJFyITAU7DfZYXge4DON9SgVK5Ygye5w"

$headers = @{
    "apikey" = $anonKey
    "Authorization" = "Bearer $anonKey"
}

# Function to scan folder
function Scan-Folder {
    param($prefix)
    
    $listUrl = "$supabaseUrl/storage/v1/object/list/$bucket"
    if ($prefix) {
        $listUrl += "?prefix=$([System.Uri]::EscapeDataString($prefix))"
    }
    
    try {
        $response = Invoke-RestMethod -Uri $listUrl -Headers $headers -Method Get
        return $response
    } catch {
        Write-Host "Error scanning $prefix : $($_.Exception.Message)" -ForegroundColor Red
        return @()
    }
}

Write-Host "Scanning bucket root..." -ForegroundColor Yellow
$rootItems = Scan-Folder -prefix ""

Write-Host "Found $($rootItems.Count) items in root" -ForegroundColor White
Write-Host ""

if ($rootItems.Count -eq 0) {
    Write-Host "BUCKET IS EMPTY!" -ForegroundColor Red
    exit
}

Write-Host "ROOT LEVEL FOLDERS/FILES:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Gray

$totalImages = 0
$folderStructure = @{}

foreach ($item in $rootItems) {
    $name = $item.name
    
    # Check if it's a folder (ends with /)
    if ($name -match '/$') {
        Write-Host "[FOLDER] $name" -ForegroundColor Green
        
        # Scan inside this folder
        $subItems = Scan-Folder -prefix $name
        Write-Host "  -> Contains $($subItems.Count) items" -ForegroundColor Gray
        
        # Check for Current and Vision subfolders
        foreach ($subItem in $subItems) {
            $subName = $subItem.name -replace "^$([regex]::Escape($name))", ""
            
            if ($subName -match '^Current/') {
                Write-Host "    [SUBFOLDER] Current/" -ForegroundColor Yellow
                $currentItems = Scan-Folder -prefix "$name/Current"
                $imageCount = ($currentItems | Where-Object { $_.name -match '\.(jpg|jpeg|png|gif|webp)$' }).Count
                Write-Host "      -> $imageCount images" -ForegroundColor White
                $totalImages += $imageCount
            }
            elseif ($subName -match '^Vision/') {
                Write-Host "    [SUBFOLDER] Vision/" -ForegroundColor Yellow
                $visionItems = Scan-Folder -prefix "$name/Vision"
                $imageCount = ($visionItems | Where-Object { $_.name -match '\.(jpg|jpeg|png|gif|webp)$' }).Count
                Write-Host "      -> $imageCount images" -ForegroundColor White
                $totalImages += $imageCount
            }
        }
    } else {
        # It's a file
        if ($name -match '\.(jpg|jpeg|png|gif|webp)$') {
            Write-Host "[IMAGE] $name" -ForegroundColor Magenta
            $totalImages++
        } else {
            Write-Host "[FILE] $name" -ForegroundColor Gray
        }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TOTAL IMAGES FOUND: $totalImages" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Now scan specific zone folders
Write-Host "Checking specific zone folders..." -ForegroundColor Yellow
Write-Host ""

$expectedZones = @(
    "Tropical Dome Greenhouse",
    "Agricultural Hub",
    "Events & Gatherings Hub",
    "Main Residence Compound",
    "Beekeeping & Honey Production",
    "Mushroom Cultivation",
    "Community Hub",
    "Retreat Village",
    "Infrastructure & Utilities",
    "McQueens Garage & Creative",
    "Ceremonial Infrastructure",
    "Wellness & Spa Facilities",
    "Livestock & Dairy Program",
    "Creative Workshop & Art Creation Center",
    "Creek-Side Glamping & Lodging Village",
    "Sulphur Mountain Gatelodge (Operations ADU)",
    "Sulphur Mountain Sanctuary The Living Landscape",
    "Farmstead Produce Stand & Online Hub",
    "Property"
)

foreach ($zone in $expectedZones) {
    Write-Host "Checking: $zone" -ForegroundColor Cyan
    
    # Try with exact name
    $items = Scan-Folder -prefix $zone
    
    if ($items.Count -gt 0) {
        Write-Host "  FOUND - $($items.Count) items" -ForegroundColor Green
        
        # Check Current
        $currentPath = "$zone/Current"
        $currentItems = Scan-Folder -prefix $currentPath
        $currentImages = ($currentItems | Where-Object { $_.name -match '\.(jpg|jpeg|png|gif|webp)$' }).Count
        Write-Host "    Current: $currentImages images" -ForegroundColor White
        
        # Check Vision
        $visionPath = "$zone/Vision"
        $visionItems = Scan-Folder -prefix $visionPath
        $visionImages = ($visionItems | Where-Object { $_.name -match '\.(jpg|jpeg|png|gif|webp)$' }).Count
        Write-Host "    Vision: $visionImages images" -ForegroundColor White
    } else {
        Write-Host "  NOT FOUND" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host ""
Write-Host "Scan complete!" -ForegroundColor Green
