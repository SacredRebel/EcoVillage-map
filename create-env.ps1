# Create .env file with Supabase credentials
$envContent = @"
SUPABASE_URL=https://klokwelpowqixscecakh.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtsb2t3ZWxwb3dxaXhzY2VjYWtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MzIzMTAsImV4cCI6MjA3NjIwODMxMH0.OtQJmxvy6kXIJFyITAU7DfZYXge4DON9SgVK5Ygye5w
SUPABASE_BUCKET=eco-village-images
"@

$envContent | Out-File -FilePath ".env" -Encoding utf8 -NoNewline

Write-Host "Success - .env file created" -ForegroundColor Green
Write-Host ""
Write-Host "Configuration:" -ForegroundColor Cyan
Write-Host "URL: https://klokwelpowqixscecakh.supabase.co" -ForegroundColor White
Write-Host "Bucket: eco-village-images" -ForegroundColor White
Write-Host ""
