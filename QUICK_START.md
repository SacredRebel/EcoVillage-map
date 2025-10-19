# 🚀 Quick Start - Image Preparation for Supabase

**3 simple steps to prepare your images for upload**

---

## Step 1️⃣ - Fix Folder Names (5 seconds)

```powershell
.\fix-folder-names.ps1
```

**What it does:**
- ✅ Renames "Tropical Dome House" → "Tropical Dome Greenhouse" 🌴
- ✅ Renames "Events & Workshops" → "Events & Gatherings Hub" 🎪
- ✅ Verifies all 18 zone folders exist

---

## Step 2️⃣ - Optimize Images (2-5 minutes)

```powershell
.\optimize-images.ps1
```

**What it does:**
- 🗜️ Compresses images (80-90% smaller)
- ✏️ Renames with SEO-friendly names
- 📁 Organizes into Current/Vision folders
- ⚡ Makes loading 5-10x faster

**Optional Requirement:**
- ImageMagick (for compression) - https://imagemagick.org/
- Script works without it but won't compress images

---

## Step 3️⃣ - Upload to Supabase

1. Open your Supabase dashboard
2. Go to **Storage** → **eco-village-images** bucket
3. Upload the entire **images** folder
4. Keep the exact folder structure

---

## ✅ Verify It Works

1. Visit `http://localhost:5001`
2. Click any zone icon (🌴, 🎪, 🏠, etc.)
3. Check that images load in 1-3 seconds
4. Verify Current and Vision tabs both work

---

## 📊 What You'll Get

| Before | After |
|--------|-------|
| ❌ Wrong folder names | ✅ All folders match zones |
| 🐌 10-30 sec loading | ⚡ 1-3 sec loading |
| 💾 5-20MB per image | 💾 200-800KB per image |
| 📝 IMG_1234.jpg | 📝 tropical-dome-greenhouse-current-1.jpg |
| 🔀 Messy organization | 📁 Clean Current/Vision folders |

---

## 🆘 Need Help?

Read the full guides:
- **IMAGE_UPLOAD_GUIDE.md** - Complete detailed instructions
- **FOLDER_ANALYSIS.md** - See what was found in your folders

---

**That's it! 3 commands and you're ready to upload!** 🎉
