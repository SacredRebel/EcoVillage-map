# ===================================================================
# EcoVillageBuilder - Safe Cleanup Script
# ===================================================================
# Date: October 10, 2025
# Purpose: Clean up old/duplicate files safely
# Backup: EcoVillageBuilder_BACKUP_20251010_223810
# ===================================================================

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "  EcoVillageBuilder Cleanup Script" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

# Check if backup exists
if (!(Test-Path "..\EcoVillageBuilder_BACKUP_20251010_223810")) {
    Write-Host "⚠️  ERROR: Backup not found!" -ForegroundColor Red
    Write-Host "Please create backup first before running cleanup." -ForegroundColor Red
    exit
}

Write-Host "✅ Backup verified: EcoVillageBuilder_BACKUP_20251010_223810" -ForegroundColor Green
Write-Host ""

# ===================================================================
# PHASE 1: DELETE TEMPORARY FILES (ZERO RISK)
# ===================================================================

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host "PHASE 1: Removing Temporary Files (Zero Risk)" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host ""

$tempFiles = @(
    "temp-output.html",
    "test-output.txt",
    "test-server.js",
    "test-simple.js"
)

foreach ($file in $tempFiles) {
    if (Test-Path $file) {
        $size = (Get-Item $file).Length
        Remove-Item $file -Force
        Write-Host "🗑️  Deleted: $file ($size bytes)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Not found: $file" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "✅ Phase 1 Complete: Temporary files removed" -ForegroundColor Green
Write-Host ""

# ===================================================================
# PHASE 2: DELETE CLEARLY BROKEN/OLD FILES (LOW RISK)
# ===================================================================

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host "PHASE 2: Removing Broken/Old Server Files (Low Risk)" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host ""

$oldFiles = @(
    "server-complete.BROKEN.js",
    "server-complete.OLD-748lines.js",
    "server-js.js"
)

foreach ($file in $oldFiles) {
    if (Test-Path $file) {
        $size = (Get-Item $file).Length
        Remove-Item $file -Force
        Write-Host "🗑️  Deleted: $file ($size bytes)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Not found: $file" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "✅ Phase 2 Complete: Broken/old files removed" -ForegroundColor Green
Write-Host ""

# ===================================================================
# PHASE 3: ARCHIVE OLD WORKING VERSIONS (SAFE)
# ===================================================================

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host "PHASE 3: Archiving Old Working Versions (Safe)" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host ""

# Create archive directory
if (!(Test-Path "archive")) {
    New-Item -ItemType Directory -Path "archive" -Force | Out-Null
    Write-Host "📁 Created: archive/" -ForegroundColor Cyan
}

$archiveFiles = @(
    "server-working.js",
    "server-final.js",
    "server-interactive.js",
    "server-drag-drop.js"
)

foreach ($file in $archiveFiles) {
    if (Test-Path $file) {
        $size = (Get-Item $file).Length
        Move-Item $file -Destination "archive\" -Force
        Write-Host "📦 Archived: $file ($size bytes)" -ForegroundColor Cyan
    } else {
        Write-Host "⚠️  Not found: $file" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "✅ Phase 3 Complete: Old versions archived" -ForegroundColor Green
Write-Host ""

# ===================================================================
# PHASE 4: ORGANIZE DOCUMENTATION (SAFE)
# ===================================================================

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host "PHASE 4: Organizing Documentation (Safe)" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host ""

# Create docs/archive directory
if (!(Test-Path "docs")) {
    New-Item -ItemType Directory -Path "docs" -Force | Out-Null
}
if (!(Test-Path "docs\archive")) {
    New-Item -ItemType Directory -Path "docs\archive" -Force | Out-Null
    Write-Host "📁 Created: docs/archive/" -ForegroundColor Cyan
}

$archiveDocs = @(
    "ENCODING_FIX_FINAL.md",
    "FINAL-FIX.md",
    "FIXED.md",
    "MAP_VERSIONS_ANALYSIS.md",
    "RESTORATION_COMPLETE.md"
)

foreach ($doc in $archiveDocs) {
    if (Test-Path $doc) {
        $size = (Get-Item $doc).Length
        Move-Item $doc -Destination "docs\archive\" -Force
        Write-Host "📄 Archived: $doc ($size bytes)" -ForegroundColor Cyan
    } else {
        Write-Host "⚠️  Not found: $doc" -ForegroundColor Gray
    }
}

# Keep important docs in root
Write-Host ""
Write-Host "📌 Keeping in root:" -ForegroundColor White
Write-Host "   - README.md (main documentation)" -ForegroundColor White
Write-Host "   - QUICKSTART.md (getting started guide)" -ForegroundColor White
Write-Host "   - TROUBLESHOOTING.md (help guide)" -ForegroundColor White
Write-Host "   - CODEBASE_ANALYSIS_COMPLETE.md (this analysis)" -ForegroundColor White

Write-Host ""
Write-Host "✅ Phase 4 Complete: Documentation organized" -ForegroundColor Green
Write-Host ""

# ===================================================================
# SUMMARY
# ===================================================================

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "  ✅ CLEANUP COMPLETE!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host ""

Write-Host "📊 Summary:" -ForegroundColor Cyan
Write-Host "   ✅ Temporary files removed" -ForegroundColor Green
Write-Host "   ✅ Broken/old files deleted" -ForegroundColor Green
Write-Host "   ✅ Old versions archived to archive/" -ForegroundColor Green
Write-Host "   ✅ Documentation organized in docs/archive/" -ForegroundColor Green
Write-Host ""

Write-Host "📁 Current Structure:" -ForegroundColor Cyan
Write-Host "   ├── server-complete.js     ← PRODUCTION (keep)" -ForegroundColor White
Write-Host "   ├── package.json           ← Configuration (keep)" -ForegroundColor White
Write-Host "   ├── startup.js             ← Backup launcher (keep)" -ForegroundColor White
Write-Host "   ├── start-map.js           ← Simple launcher (keep)" -ForegroundColor White
Write-Host "   ├── README.md              ← Main docs (keep)" -ForegroundColor White
Write-Host "   ├── QUICKSTART.md          ← Getting started (keep)" -ForegroundColor White
Write-Host "   ├── TROUBLESHOOTING.md     ← Help guide (keep)" -ForegroundColor White
Write-Host "   ├── archive/               ← Old server versions" -ForegroundColor Gray
Write-Host "   └── docs/archive/          ← Old documentation" -ForegroundColor Gray
Write-Host ""

Write-Host "🔄 To start your server:" -ForegroundColor Cyan
Write-Host "   node server-complete.js" -ForegroundColor White
Write-Host ""

Write-Host "💾 Backup Location:" -ForegroundColor Cyan
Write-Host "   ..\EcoVillageBuilder_BACKUP_20251010_223810\" -ForegroundColor White
Write-Host ""

Write-Host "🎉 Your codebase is now clean and organized!" -ForegroundColor Green
Write-Host ""

# Optional: Show disk space saved
$archiveSize = 0
if (Test-Path "archive") {
    $archiveSize = (Get-ChildItem "archive" -File | Measure-Object -Property Length -Sum).Sum
}
$docsArchiveSize = 0
if (Test-Path "docs\archive") {
    $docsArchiveSize = (Get-ChildItem "docs\archive" -File | Measure-Object -Property Length -Sum).Sum
}

$totalArchived = $archiveSize + $docsArchiveSize
if ($totalArchived -gt 0) {
    $totalArchivedKB = [math]::Round($totalArchived / 1KB, 2)
    Write-Host "💾 Total archived: $totalArchivedKB KB" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "=====================================================" -ForegroundColor Cyan
