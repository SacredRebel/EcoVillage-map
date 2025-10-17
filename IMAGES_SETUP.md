# 📸 Images Setup Guide

## ⚠️ Issue: Windows Path Length Limitations

The `images/` folder contains some files with very long filenames that exceed Windows' 260-character path limit, preventing them from being committed to Git.

**Example problematic file:**
```
images/Ceremonial Infrastructure/vision/DALL·E 2025-09-13 12.47.20 - A ceremonial outdoor space...webp
```

## ✅ Solution Options

### Option 1: Use Vercel Blob Storage (Recommended for Production)

1. **Install Vercel Blob SDK:**
```bash
npm install @vercel/blob
```

2. **Upload images to Vercel Blob:**
```javascript
import { put } from '@vercel/blob';

const blob = await put('agricultural-hub/current/farm1.jpg', file, {
  access: 'public',
});
// blob.url = https://your-blob-url.vercel-blob.store/...
```

3. **Update API to fetch from Blob:**
```javascript
import { list } from '@vercel/blob';

app.get('/api/images/:zoneId/:category', async (req, res) => {
  const { zoneId, category } = req.params;
  const { blobs } = await list({ prefix: `${zoneId}/${category}/` });
  res.json({ images: blobs.map(b => b.url) });
});
```

### Option 2: Use Cloudinary

1. **Sign up at cloudinary.com**
2. **Upload images via dashboard**
3. **Use Cloudinary URLs** in your image API

### Option 3: GitHub LFS (Large File Storage)

For files too large or with long names:
```bash
git lfs install
git lfs track "images/**/*.webp"
git lfs track "images/**/*.jpg"
git add .gitattributes
git commit -m "Track images with LFS"
```

### Option 4: Shorten Filenames Locally

Rename long filenames before committing:
```bash
# Example
ceremonial-gathering-space.webp (instead of DALL·E 2025...)
farm-produce-1.jpg
retreat-cabin-exterior.jpg
```

## 📁 Current Image Structure

```
images/
├── Agricultural Hub/
│   ├── current/
│   ├── progress/
│   └── vision/
├── Farmstead Produce Stand & Online Hub/
│   ├── current/
│   ├── progress/
│   └── vision/
└── [14 other project folders...]
```

## 🎯 Quick Fix for Development

For local development, images work fine. The folder structure is already in place.

For production deployment, choose one of the options above to host images externally.

## 🔗 API Endpoints

The app already has image API endpoints ready:
- `/api/images/:zoneId/current`
- `/api/images/:zoneId/progress`
- `/api/images/:zoneId/vision`

These will return empty arrays until images are hosted externally or committed to Git with shortened filenames.
