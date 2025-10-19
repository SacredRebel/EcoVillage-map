# 🖼️ Image Upload & Optimization Guide for Supabase

## 📋 Pre-Upload Checklist

Before uploading images to Supabase, follow these steps to ensure proper organization, SEO-friendly naming, and fast loading times.

---

## 🔧 Step 1: Fix Folder Names

**Run this first to ensure folder names match zone configurations:**

```powershell
.\fix-folder-names.ps1
```

### What It Does:
- ✅ Renames "Tropical Dome House" → "Tropical Dome Greenhouse"
- ✅ Renames "Events & Workshops" → "Events & Gatherings Hub"
- ✅ Verifies all 18 zone folders + Property folder exist
- ✅ Creates missing folders automatically

---

## 🖼️ Step 2: Optimize Images

**Run this to optimize all images for fast loading:**

```powershell
.\optimize-images.ps1
```

### What It Does:
- 🗜️ **Compresses images** to reduce file size (85% quality, max width 1920px)
- ✏️ **Renames images** with SEO-friendly names based on zone
- 📁 **Organizes images** into Current/Vision subfolders
- 🚀 **Reduces loading times** significantly

### Requirements:
- **ImageMagick** (optional but recommended for compression)
  - Download: https://imagemagick.org/script/download.php
  - If not installed, script will still rename and organize images

---

## 📁 Folder Structure

Each zone should have this structure:

```
images/
├── Agricultural Hub/
│   ├── Current/
│   │   ├── agricultural-hub-current-1.jpg
│   │   ├── agricultural-hub-current-2.jpg
│   │   └── agricultural-hub-current-3.jpg
│   └── Vision/
│       ├── agricultural-hub-vision-1.jpg
│       └── agricultural-hub-vision-2.jpg
├── Beekeeping & Honey Production/
│   ├── Current/
│   └── Vision/
├── Ceremonial Infrastructure/
│   ├── Current/
│   └── Vision/
...and so on for all 18 zones
```

---

## 🎯 Complete Zone List (18 Zones + Property)

### All Zone Folders Required:

1. **Agricultural Hub**
2. **Beekeeping & Honey Production**
3. **Ceremonial Infrastructure**
4. **Community Hub**
5. **Creative Workshop & Art Creation Center**
6. **Creek-Side Glamping & Lodging Village**
7. **Events & Gatherings Hub** ⭐ (renamed from "Events & Workshops")
8. **Farmstead Produce Stand & Online Hub**
9. **Infrastructure & Utilities**
10. **Livestock & Dairy Program**
11. **Main Residence Compound**
12. **McQueen's Garage & Creative**
13. **Mushroom Cultivation**
14. **Retreat Village**
15. **Sulphur Mountain Gatelodge (Operations ADU)**
16. **Sulphur Mountain Sanctuary The Living Landscape**
17. **Tropical Dome Greenhouse** 🌴 ⭐ (renamed from "Tropical Dome House")
18. **Wellness & Spa Facilities**
19. **Property** (for boundary/map images)

---

## 📝 SEO-Friendly Naming Convention

Images are automatically renamed following this pattern:

### Current Images:
```
{zone-slug}-current-{number}.{ext}

Examples:
- agricultural-hub-current-1.jpg
- tropical-dome-greenhouse-current-1.jpg
- events-gatherings-hub-current-1.jpg
```

### Vision Images:
```
{zone-slug}-vision-{number}.{ext}

Examples:
- agricultural-hub-vision-1.jpg
- tropical-dome-greenhouse-vision-1.jpg
- events-gatherings-hub-vision-1.jpg
```

### SEO Zone Slugs:
| Zone Folder | SEO Slug |
|-------------|----------|
| Agricultural Hub | `agricultural-hub` |
| Beekeeping & Honey Production | `beekeeping-honey-production` |
| Ceremonial Infrastructure | `ceremonial-infrastructure` |
| Community Hub | `community-hub` |
| Creative Workshop & Art Creation Center | `creative-workshop-art-center` |
| Creek-Side Glamping & Lodging Village | `creek-glamping-village` |
| Events & Gatherings Hub | `events-gatherings-hub` |
| Farmstead Produce Stand & Online Hub | `farmstead-produce-stand` |
| Infrastructure & Utilities | `infrastructure-utilities` |
| Livestock & Dairy Program | `livestock-dairy-program` |
| Main Residence Compound | `main-residence` |
| McQueen's Garage & Creative | `mcqueens-garage-creative` |
| Mushroom Cultivation | `mushroom-cultivation` |
| Retreat Village | `retreat-village` |
| Sulphur Mountain Gatelodge (Operations ADU) | `gatelodge-operations` |
| Sulphur Mountain Sanctuary The Living Landscape | `sanctuary-living-landscape` |
| Tropical Dome Greenhouse | `tropical-dome-greenhouse` |
| Wellness & Spa Facilities | `wellness-spa-facilities` |
| Property | `property-boundary` |

---

## 🗜️ Image Optimization Settings

### Automatic Optimization:
- **Max Width:** 1920px (maintains aspect ratio)
- **Quality:** 85% (optimal balance of quality vs. file size)
- **Format:** Preserves original (JPG, PNG, WebP, GIF)
- **Compression:** Lossless when possible, minimal loss when needed

### Expected Results:
- 📉 **40-70% file size reduction** for most images
- ⚡ **2-5x faster loading times**
- 🎨 **No visible quality loss**
- 💾 **Significant storage savings**

---

## 📤 Supabase Upload Structure

Upload to your Supabase bucket using this exact structure:

```
Bucket: eco-village-images
├── Agricultural Hub/
│   ├── Current/
│   │   └── agricultural-hub-current-1.jpg
│   └── Vision/
│       └── agricultural-hub-vision-1.jpg
├── Tropical Dome Greenhouse/
│   ├── Current/
│   │   └── tropical-dome-greenhouse-current-1.jpg
│   └── Vision/
│       └── tropical-dome-greenhouse-vision-1.jpg
...etc
```

---

## ✅ Upload Checklist

Before uploading to Supabase:

- [ ] Run `.\fix-folder-names.ps1` to correct folder names
- [ ] Run `.\optimize-images.ps1` to compress and rename images
- [ ] Verify all 18 zone folders exist
- [ ] Check that each zone has Current and/or Vision subfolders
- [ ] Confirm images are properly named with SEO slugs
- [ ] Ensure images are under 2MB each (ideally under 500KB)
- [ ] Upload to Supabase bucket: `eco-village-images`

---

## 🚀 After Upload

Once images are uploaded to Supabase:

1. **Test Image Loading:**
   - Visit `http://localhost:5001`
   - Click each zone icon on the map
   - Verify Current/Vision images load correctly

2. **Check Performance:**
   - Images should load within 1-2 seconds
   - No visible quality degradation
   - Smooth carousel navigation

3. **Verify SEO:**
   - Image filenames are descriptive
   - Browser network tab shows optimized sizes
   - Alt text is automatically generated from filenames

---

## 🔍 Troubleshooting

### Folder Names Don't Match
**Problem:** Zone images not loading  
**Solution:** Run `.\fix-folder-names.ps1` and re-upload

### Images Too Large
**Problem:** Slow loading times  
**Solution:** Run `.\optimize-images.ps1` before upload

### Missing Current/Vision Folders
**Problem:** Images not organized  
**Solution:** Script auto-creates folders and sorts images by keywords

### ImageMagick Not Installed
**Problem:** Images not compressed  
**Solution:** Download from https://imagemagick.org/ and re-run script

---

## 📊 Expected Results

### Before Optimization:
- 📁 Mixed folder names (not matching zones)
- 🖼️ Random image filenames
- 💾 Large file sizes (5-20MB per image)
- 🐌 Slow loading (10-30 seconds)

### After Optimization:
- ✅ Correct folder structure matching all zones
- ✅ SEO-friendly image names
- ✅ Compressed files (200KB-2MB per image)
- ✅ Fast loading (1-3 seconds)

---

## 🎯 Quick Start

**Three simple steps:**

```powershell
# 1. Fix folder names
.\fix-folder-names.ps1

# 2. Optimize images
.\optimize-images.ps1

# 3. Upload to Supabase
# Use Supabase dashboard to upload the entire 'images' folder
```

---

**Your images are now ready for professional, fast-loading display on the interactive map!** 🚀✨
