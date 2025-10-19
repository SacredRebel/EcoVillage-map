# 🎯 How to Add Your Image URLs - SIMPLE!

## ✅ **Solution is Ready!**

I've created a simple configuration file where you just **copy/paste URLs** from Supabase.

---

## 📋 **Step-by-Step Instructions**

### **Step 1: Open Supabase Storage**

Go to your Supabase storage:
```
https://supabase.com/dashboard/project/klokwelpowqixscecakh/storage/buckets/eco-village-images
```

### **Step 2: Navigate to a Zone Folder**

1. Click into `images/` folder
2. Click into a zone folder (e.g., `Ceremonial Infrastructure/`)
3. Click into `vision/` or `current/` folder
4. You'll see your image files

### **Step 3: Copy Image URLs**

For each image:
1. Click the **three dots (⋮)** next to the image
2. Click **"Copy URL"** or **"Get public URL"**
3. You'll get a URL like:
   ```
   https://klokwelpowqixscecakh.supabase.co/storage/v1/object/public/eco-village-images/images/Ceremonial%20Infrastructure/vision/ceremonie%20space.jpg
   ```

### **Step 4: Paste URLs into `image-urls.js`**

1. Open the file: `image-urls.js`
2. Find the zone section (e.g., `'ceremonial-infrastructure'`)
3. Paste URLs into the array:

```javascript
'ceremonial-infrastructure': {
  current: [
    'https://klokwelpowqixscecakh.supabase.co/storage/v1/object/public/eco-village-images/images/Ceremonial%20Infrastructure/current/image1.jpg',
    'https://klokwelpowqixscecakh.supabase.co/storage/v1/object/public/eco-village-images/images/Ceremonial%20Infrastructure/current/image2.jpg',
    // Add more...
  ],
  vision: [
    'https://klokwelpowqixscecakh.supabase.co/storage/v1/object/public/eco-village-images/images/Ceremonial%20Infrastructure/vision/ceremonie%20space.jpg',
    // Add more...
  ]
},
```

### **Step 5: Save and Restart**

```powershell
# Restart server
.\kill-node.ps1
npm run dev
```

### **Step 6: Test**

Open `http://localhost:5001` and click a zone!

---

## 🚀 **Quick Example**

### **Before (empty):**
```javascript
'ceremonial-infrastructure': {
  current: [],
  vision: []
},
```

### **After (with URLs):**
```javascript
'ceremonial-infrastructure': {
  current: [
    'https://klokwelpowqixscecakh.supabase.co/storage/v1/object/public/eco-village-images/images/Ceremonial%20Infrastructure/current/image1.jpg',
    'https://klokwelpowqixscecakh.supabase.co/storage/v1/object/public/eco-village-images/images/Ceremonial%20Infrastructure/current/image2.jpg',
  ],
  vision: [
    'https://klokwelpowqixscecakh.supabase.co/storage/v1/object/public/eco-village-images/images/Ceremonial%20Infrastructure/vision/ceremonie%20space.jpg',
    'https://klokwelpowqixscecakh.supabase.co/storage/v1/object/public/eco-village-images/images/Ceremonial%20Infrastructure/vision/sacred-circle.jpg',
  ]
},
```

---

## 📝 **Zone Name Mappings**

Match Supabase folder names to zone IDs in `image-urls.js`:

| Supabase Folder Name | Zone ID in image-urls.js |
|----------------------|--------------------------|
| Ceremonial Infrastructure | `ceremonial-infrastructure` |
| Agricultural Hub | `agricultural-hub` |
| Beekeeping & Honey Production | `beekeeping` |
| Community Hub | `community-hub` |
| Creative Workshop & Art Creation Center | `creative-workshop-center` |
| Creek-Side Glamping & Lodging Village | `glamping-creek-village` |
| Events & Gatherings Hub | `events-gatherings-hub` |
| Farmstead Produce Stand & Online Hub | `farmstead-produce-stand` |
| Infrastructure & Utilities | `infrastructure` |
| Livestock & Dairy Program | `livestock-program` |
| Main Residence Compound | `main-residence` |
| McQueen's Garage & Creative | `mcqueens-garage` |
| Mushroom Cultivation | `mushroom-cultivation` |
| Retreat Village | `retreat-village` |
| Tropical Dome Greenhouse | `tropical-dome-greenhouse` |
| Wellness & Spa Facilities | `wellness-spa` |
| Sulphur Mountain Gatelodge (Operations ADU) | `gatelodge-operations-hub` |
| Sulphur Mountain Sanctuary | `sulphur-mountain-sanctuary` |

---

## 💡 **Pro Tips**

### **Faster Method: Browser Console**

If you have many images, use browser console:

1. Open Supabase storage in browser
2. Open browser DevTools (F12)
3. Run this script to copy all URLs:

```javascript
// Get all file rows
const files = document.querySelectorAll('[data-type="file"]');
const urls = [];

files.forEach(file => {
  const name = file.textContent.trim();
  const path = window.location.pathname;
  const url = `https://klokwelpowqixscecakh.supabase.co/storage/v1/object/public/eco-village-images${path}/${name}`;
  urls.push(`'${url}',`);
});

console.log(urls.join('\n'));
copy(urls.join('\n'));
```

This copies all URLs to clipboard!

---

## ✅ **That's It!**

Just copy/paste URLs from Supabase into `image-urls.js` and they'll display on the map! 🎉

**No permissions needed, no API issues, just simple URLs!**
