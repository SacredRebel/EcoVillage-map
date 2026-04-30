/**
 * compress-images.js
 *
 * Compresses all images from SOURCE_DIR into OUTPUT_DIR (repo's images/ folder).
 * Run from the repo root: node scripts/compress-images.js
 *
 * Requirements: npm install --save-dev sharp
 */

import sharp from 'sharp';
import { readdir, mkdir, stat } from 'fs/promises';
import { join, extname, relative } from 'path';

// ── Configure these two paths ────────────────────────────────────────────────
const SOURCE_DIR = 'F:\\AI apps & websites\\EcoVillageBuilder\\EcoVillageBuilder\\images';
const OUTPUT_DIR = './images'; // repo root — already served at /images by Express
// ─────────────────────────────────────────────────────────────────────────────

const SUPPORTED = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);
const MAX_WIDTH = 1920;   // px — enough for full-screen display
const JPEG_QUALITY = 82;  // 0-100, 82 is a great balance of size vs quality
const PNG_QUALITY = 80;

let processed = 0;
let skipped = 0;
let errors = 0;
let savedBytes = 0;

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
  const destPath = join(OUTPUT_DIR, relPath);
  const destDir = join(OUTPUT_DIR, relative(SOURCE_DIR, srcPath.substring(0, srcPath.lastIndexOf('\\') || srcPath.lastIndexOf('/'))));

  await mkdir(destDir, { recursive: true });

  const ext = extname(srcPath).toLowerCase();
  const srcStat = await stat(srcPath);

  try {
    const image = sharp(srcPath).resize({ width: MAX_WIDTH, withoutEnlargement: true });

    if (ext === '.png') {
      await image.png({ compressionLevel: 9, quality: PNG_QUALITY }).toFile(destPath);
    } else {
      // JPG, JPEG, WEBP, GIF → output as JPEG for best compression
      const outPath = destPath.replace(/\.(webp|gif)$/i, '.jpg');
      await image.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(outPath);
    }

    const destStat = await stat(destPath);
    const saved = srcStat.size - destStat.size;
    savedBytes += saved;
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
  console.log('');
  console.log('Next steps:');
  console.log('  1. Check the images/ folder looks correct');
  console.log('  2. git add images/');
  console.log('  3. git commit -m "Add compressed images for local hosting"');
  console.log('  4. git push');
}

main();
