# Image Optimization Script for Supabase Upload
# Optimizes images for fast loading, renames for SEO, and organizes into Current/Vision folders

Write-Host "🖼️  Starting Image Optimization Process..." -ForegroundColor Cyan
Write-Host ""

$imagesPath = "f:\AI apps & websites\EcoVillageBuilder\EcoVillageBuilder\images"

# Check if ImageMagick is installed (required for optimization)
try {
    $magickVersion = magick -version 2>&1
    Write-Host "✅ ImageMagick detected" -ForegroundColor Green
    $hasImageMagick = $true
} catch {
    Write-Host "⚠️  ImageMagick not found - will skip image compression" -ForegroundColor Yellow
    Write-Host "   Install from: https://imagemagick.org/script/download.php" -ForegroundColor Yellow
    $hasImageMagick = $false
}

Write-Host ""

# SEO-friendly zone name mappings
$zoneNameMap = @{
    "Agricultural Hub" = "agricultural-hub"
    "Main Residence Compound" = "main-residence"
    "Community Hub" = "community-hub"
    "Retreat Village" = "retreat-village"
    "Infrastructure & Utilities" = "infrastructure-utilities"
    "McQueen's Garage & Creative" = "mcqueens-garage-creative"
    "Ceremonial Infrastructure" = "ceremonial-infrastructure"
    "Wellness & Spa Facilities" = "wellness-spa-facilities"
    "Mushroom Cultivation" = "mushroom-cultivation"
    "Beekeeping & Honey Production" = "beekeeping-honey-production"
    "Events & Gatherings Hub" = "events-gatherings-hub"
    "Livestock & Dairy Program" = "livestock-dairy-program"
    "Creative Workshop & Art Creation Center" = "creative-workshop-art-center"
    "Creek-Side Glamping & Lodging Village" = "creek-glamping-village"
    "Sulphur Mountain Gatelodge (Operations ADU)" = "gatelodge-operations"
    "Tropical Dome Greenhouse" = "tropical-dome-greenhouse"
    "Sulphur Mountain Sanctuary The Living Landscape" = "sanctuary-living-landscape"
    "Farmstead Produce Stand & Online Hub" = "farmstead-produce-stand"
    "Property" = "property-boundary"
}

# Get all zone folders
$zoneFolders = Get-ChildItem -Path $imagesPath -Directory

$totalImages = 0
$optimizedImages = 0
$renamedImages = 0

foreach ($zoneFolder in $zoneFolders) {
    $zoneName = $zoneFolder.Name
    $seoPrefix = $zoneNameMap[$zoneName]
    
    if (-not $seoPrefix) {
        Write-Host "⚠️  Unknown zone folder: $zoneName - skipping" -ForegroundColor Yellow
        continue
    }
    
    Write-Host "📁 Processing: $zoneName" -ForegroundColor Cyan
    
    # Check for Current and Vision subfolders
    $currentFolder = Join-Path $zoneFolder.FullName "Current"
    $visionFolder = Join-Path $zoneFolder.FullName "Vision"
    
    $hasCurrent = Test-Path $currentFolder
    $hasVision = Test-Path $visionFolder
    
    # If no subfolders, create them and move images
    if (-not $hasCurrent -and -not $hasVision) {
        $images = Get-ChildItem -Path $zoneFolder.FullName -File -Include *.jpg,*.jpeg,*.png,*.webp,*.gif
        
        if ($images.Count -gt 0) {
            Write-Host "   Creating Current and Vision subfolders..." -ForegroundColor Yellow
            New-Item -Path $currentFolder -ItemType Directory -Force | Out-Null
            New-Item -Path $visionFolder -ItemType Directory -Force | Out-Null
            
            # Prompt user or use simple logic: images with "vision", "render", "plan" go to Vision
            foreach ($img in $images) {
                if ($img.Name -match "(vision|render|plan|future|concept|design)") {
                    Move-Item -Path $img.FullName -Destination $visionFolder
                    Write-Host "   → Moved to Vision: $($img.Name)" -ForegroundColor Magenta
                } else {
                    Move-Item -Path $img.FullName -Destination $currentFolder
                    Write-Host "   → Moved to Current: $($img.Name)" -ForegroundColor Magenta
                }
            }
        }
    }
    
    # Process images in Current folder
    if (Test-Path $currentFolder) {
        $currentImages = Get-ChildItem -Path $currentFolder -File -Include *.jpg,*.jpeg,*.png,*.webp,*.gif
        
        foreach ($img in $currentImages) {
            $totalImages++
            $counter = $currentImages.IndexOf($img) + 1
            
            # Generate SEO-friendly name
            $extension = $img.Extension.ToLower()
            $newName = "$seoPrefix-current-$counter$extension"
            $newPath = Join-Path $currentFolder $newName
            
            # Rename if needed
            if ($img.Name -ne $newName) {
                Rename-Item -Path $img.FullName -NewName $newName -ErrorAction SilentlyContinue
                Write-Host "   ✏️  Renamed: $($img.Name) → $newName" -ForegroundColor Green
                $renamedImages++
                $img = Get-Item $newPath
            }
            
            # Optimize with ImageMagick
            if ($hasImageMagick -and ($extension -eq ".jpg" -or $extension -eq ".jpeg" -or $extension -eq ".png")) {
                $originalSize = (Get-Item $img.FullName).Length / 1MB
                
                # Resize and compress (max width 1920px, 85% quality)
                magick "$($img.FullName)" -resize "1920x1920>" -quality 85 "$($img.FullName)" 2>&1 | Out-Null
                
                $newSize = (Get-Item $img.FullName).Length / 1MB
                $savings = [math]::Round((($originalSize - $newSize) / $originalSize) * 100, 1)
                
                if ($savings -gt 5) {
                    Write-Host "   🗜️  Optimized: $newName (${savings}% smaller)" -ForegroundColor Blue
                    $optimizedImages++
                }
            }
        }
    }
    
    # Process images in Vision folder
    if (Test-Path $visionFolder) {
        $visionImages = Get-ChildItem -Path $visionFolder -File -Include *.jpg,*.jpeg,*.png,*.webp,*.gif
        
        foreach ($img in $visionImages) {
            $totalImages++
            $counter = $visionImages.IndexOf($img) + 1
            
            # Generate SEO-friendly name
            $extension = $img.Extension.ToLower()
            $newName = "$seoPrefix-vision-$counter$extension"
            $newPath = Join-Path $visionFolder $newName
            
            # Rename if needed
            if ($img.Name -ne $newName) {
                Rename-Item -Path $img.FullName -NewName $newName -ErrorAction SilentlyContinue
                Write-Host "   ✏️  Renamed: $($img.Name) → $newName" -ForegroundColor Green
                $renamedImages++
                $img = Get-Item $newPath
            }
            
            # Optimize with ImageMagick
            if ($hasImageMagick -and ($extension -eq ".jpg" -or $extension -eq ".jpeg" -or $extension -eq ".png")) {
                $originalSize = (Get-Item $img.FullName).Length / 1MB
                
                # Resize and compress (max width 1920px, 85% quality)
                magick "$($img.FullName)" -resize "1920x1920>" -quality 85 "$($img.FullName)" 2>&1 | Out-Null
                
                $newSize = (Get-Item $img.FullName).Length / 1MB
                $savings = [math]::Round((($originalSize - $newSize) / $originalSize) * 100, 1)
                
                if ($savings -gt 5) {
                    Write-Host "   🗜️  Optimized: $newName (${savings}% smaller)" -ForegroundColor Blue
                    $optimizedImages++
                }
            }
        }
    }
    
    Write-Host ""
}

# Summary
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ OPTIMIZATION COMPLETE!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📊 Total images processed: $totalImages" -ForegroundColor White
Write-Host "✏️  Images renamed for SEO: $renamedImages" -ForegroundColor Green
Write-Host "🗜️  Images optimized: $optimizedImages" -ForegroundColor Blue
Write-Host ""
Write-Host "🚀 Images are now ready for Supabase upload!" -ForegroundColor Green
Write-Host ""
