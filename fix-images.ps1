# Fix images folder - remove problematic long filename
Set-Location "images\Ceremonial Infrastructure\vision"
Get-ChildItem -Filter "DALL*.webp" | Remove-Item -Force
Write-Host "✅ Removed problematic file"
Set-Location "..\..\\.."
