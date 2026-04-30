/**
 * compress-images.js
 *
 * Compresses all images from SOURCE_DIR into OUTPUT_DIR.
 * Writes to a separate folder so it's safe even if SOURCE_DIR is your repo's images/.
 *
 * Run from the repo root: node scripts/compress-images.js
 *
 * Requirements: npm install --save-dev sharp
 */

import sharp from 'sharp';
import { readdir, mkdir, stat, rm, rename } from 'fs/promises';
import { join, extname, relative, dirname, resolve } from 'path';

// ── Configure these two paths ────────────────────────────────────────────────
const SOURCE_DIR = 'F:\\AI apps & websites\\EcoVillageBuilder\\EcoVillageBuilder\\images';
const OUTPUT_DIR = './images-compressed'; // temp folder; rename to images/ after
// ─────────────────────────────────────────────────────────────────────────────

const SUPPORTED = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
const MAX_WIDTH = 1920;
const JPEG_QUALITY = 82;
const PNG_QUALITY = 80;

let processed = 0;
let errors = 0;
let savedBytes = 0;
let totalOutputBytes = 0;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (SUPPORTED.has(extname(entry.name).toLowerCase())) {
      files.push(full);
    }
  }
  return files;
}

async function compress(srcPath) {
  const relPath = relative(SOURCE_DIR, srcPath);
  let destPath = join(OUTPUT_DIR, relPath);

  // Re-encode webp/gif to .jpg for better compatibility & size
  const ext = extname(srcPath).toLowerCase();
  if (ext === '.webp' || ext === '.gif') {
    destPath = destPath.replace(/\.(webp|gif)$/i, '.jpg');
  }

  await mkdir(dirname(destPath), { recursive: true });

  if (resolve(srcPath) === resolve(destPath)) {
    console.error(`⛔ Source and destination are the same file: ${srcPath}`);
    errors++;
    return;
  }

  const srcStat = await stat(srcPath);

  try {
    const image = sharp(srcPath).rotate().resize({ width: MAX_WIDTH, withoutEnlargement: true });

    if (ext === '.png') {
      await image.png({ compressionLevel: 9, quality: PNG_QUALITY }).toFile(destPath);
    } else {
      await image.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(destPath);
    }

    const destStat = await stat(destPath);
    const saved = srcStat.size - destStat.size;
    savedBytes += saved;
    totalOutputBytes += destStat.size;
    processed++;

    const pct = Math.round((1 - destStat.size / srcStat.size) * 100);
    console.log(`✅ ${relPath} (${(srcStat.size / 1024).toFixed(0)}KB → ${(destStat.size / 1024).toFixed(0)}KB, -${pct}%)`);
  } catch (err) {
    console.error(`❌ Failed: ${relPath} — ${err.message}`);
    errors++;
  }
}

async function main() {
  console.log('🗜️  EcoVillage Image Compressor');
  console.log(`   Source : ${SOURCE_DIR}`);
  console.log(`   Output : ${OUTPUT_DIR}`);
  console.log('');

  // Wipe any previous attempt
  try { await rm(OUTPUT_DIR, { recursive: true, force: true }); } catch {}

  let files;
  try {
    files = await walk(SOURCE_DIR);
  } catch (err) {
    console.error(`❌ Cannot read source directory: ${err.message}`);
    console.error('   Check that SOURCE_DIR path at the top of this script is correct.');
    process.exit(1);
  }

  if (files.length === 0) {
    console.warn('⚠️  No image files found in source directory.');
    process.exit(0);
  }

  console.log(`📂 Found ${files.length} images — starting compression...\n`);

  for (const file of files) {
    await compress(file);
  }

  console.log('');
  console.log('─────────────────────────────────────────');
  console.log(`✅ Done!  ${processed} compressed, ${errors} errors`);
  console.log(`💾 Space saved: ${(savedBytes / 1024 / 1024).toFixed(1)} MB`);
  console.log(`📦 Output folder size: ${(totalOutputBytes / 1024 / 1024).toFixed(1)} MB`);
  console.log('');

  if (errors > 0) {
    console.log('⚠️  Some files failed. Review the errors above before swapping folders.');
    return;
  }

  console.log('Next steps (run from your repo root):');
  console.log('  1. Inspect images-compressed/ — make sure it looks right');
  console.log('  2. Backup or delete the old images folder:');
  console.log('       Remove-Item -Recurse -Force images   # PowerShell');
  console.log('  3. Rename the compressed folder:');
  console.log('       Rename-Item images-compressed images');
  console.log('  4. git add images/');
  console.log('  5. git commit -m "Add compressed images for local hosting"');
  console.log('  6. git push');
}

main();
