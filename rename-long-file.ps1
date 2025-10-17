# Rename the problematic file with too-long filename
$oldPath = "images\Ceremonial Infrastructure\vision\DALL·E 2025-09-13 12.47.20 - A ceremonial outdoor space at a regenerative eco-village on a 3,600-acre property. The scene shows a circular gathering area with natural stone seatin.webp"
$newPath = "images\Ceremonial Infrastructure\vision\ceremonial-gathering-space.webp"

if (Test-Path $oldPath) {
    Rename-Item -Path $oldPath -NewName "ceremonial-gathering-space.webp"
    Write-Host "✅ Renamed file successfully"
} else {
    Write-Host "⚠️ File not found or already renamed"
}
