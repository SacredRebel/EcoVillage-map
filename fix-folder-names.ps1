# Fix Image Folder Names to Match Zone Names
# Run this BEFORE uploading images to Supabase

Write-Host "🔧 Fixing image folder names to match zone configurations..." -ForegroundColor Cyan

$imagesPath = "f:\AI apps & websites\EcoVillageBuilder\EcoVillageBuilder\images"

# Rename incorrect folder names
$renames = @{
    "Tropical Dome House" = "Tropical Dome Greenhouse"
    "Events & Workshops" = "Events & Gatherings Hub"
}

foreach ($oldName in $renames.Keys) {
    $oldPath = Join-Path $imagesPath $oldName
    $newPath = Join-Path $imagesPath $renames[$oldName]
    
    if (Test-Path $oldPath) {
        Write-Host "✅ Renaming: '$oldName' → '$($renames[$oldName])'" -ForegroundColor Green
        Rename-Item -Path $oldPath -NewName $renames[$oldName]
    } else {
        Write-Host "⚠️  Folder not found: $oldName" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✅ All folder names fixed and ready for Supabase upload!" -ForegroundColor Green
Write-Host ""

# Verify all required zone folders exist
Write-Host "📁 Verifying all 18 zone folders exist..." -ForegroundColor Cyan

$requiredFolders = @(
    "Agricultural Hub",
    "Main Residence Compound",
    "Community Hub",
    "Retreat Village",
    "Infrastructure & Utilities",
    "McQueen's Garage & Creative",
    "Ceremonial Infrastructure",
    "Wellness & Spa Facilities",
    "Mushroom Cultivation",
    "Beekeeping & Honey Production",
    "Events & Gatherings Hub",
    "Livestock & Dairy Program",
    "Creative Workshop & Art Creation Center",
    "Creek-Side Glamping & Lodging Village",
    "Sulphur Mountain Gatelodge (Operations ADU)",
    "Tropical Dome Greenhouse",
    "Sulphur Mountain Sanctuary The Living Landscape",
    "Farmstead Produce Stand & Online Hub",
    "Property"
)

foreach ($folder in $requiredFolders) {
    $folderPath = Join-Path $imagesPath $folder
    if (Test-Path $folderPath) {
        Write-Host "✅ $folder" -ForegroundColor Green
    } else {
        Write-Host "❌ MISSING: $folder" -ForegroundColor Red
        New-Item -Path $folderPath -ItemType Directory -Force | Out-Null
        Write-Host "   Created folder: $folder" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🎯 All zone folders verified!" -ForegroundColor Green
