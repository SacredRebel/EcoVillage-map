# 🔧 Fix Bucket Permissions - Enable Listing

## ✅ Good News!
Your images ARE in Supabase! This URL works:
```
https://klokwelpowqixscecakh.supabase.co/storage/v1/object/public/eco-village-images/images/Ceremonial%20Infrastructure/vision/ceremonie%20space.jpg
```

## ❌ The Problem
The bucket doesn't allow **LISTING** files, so the app can't discover which images exist.

**Error:** `400 Bad Request` when trying to list files

---

## ✅ Solution: Enable File Listing

### Step 1: Go to Supabase Storage Settings

1. Open: https://supabase.com/dashboard/project/klokwelpowqixscecakh/storage/buckets
2. Click on `eco-village-images` bucket
3. Click the **⚙️ Settings** button (or three dots menu)

### Step 2: Enable Public Access & Listing

Make sure these settings are enabled:

```
✅ Public bucket
✅ Allow file listing
```

### Step 3: Set Bucket Policies

You may need to add a storage policy. Go to:
- **Storage** → **Policies** → **New Policy**

Or manually in SQL Editor:

```sql
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'eco-village-images' );

-- Allow public listing
CREATE POLICY "Public List"
ON storage.objects FOR SELECT
USING ( bucket_id = 'eco-village-images' );
```

### Step 4: Alternative - Use RLS Policies

If you're using Row Level Security, you need to allow anonymous access:

```sql
-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to read
CREATE POLICY "Allow public reads"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'eco-village-images');
```

---

## 🧪 Test After Fixing

Run this to test if listing works:

```powershell
.\test-supabase-direct.ps1
```

Expected output:
```
1. Listing bucket root:
   Found 1 items
   - images/

2. Listing 'images' folder:
   Found 19 items
   - images/Ceremonial Infrastructure/
   - images/Tropical Dome Greenhouse/
   ...
```

---

## 🎯 Quick Fix Steps

1. **Go to bucket settings**
   https://supabase.com/dashboard/project/klokwelpowqixscecakh/storage/buckets/eco-village-images

2. **Check "Public bucket"** ✅

3. **Check "Allow file operations"** or **"Allow directory listing"** ✅

4. **Click Save**

5. **Restart your server:**
   ```powershell
   .\kill-node.ps1
   npm run dev
   ```

6. **Test:**
   ```powershell
   .\test-images-fixed.ps1
   ```

---

## 📊 Current Status

| Component | Status |
|-----------|--------|
| Images exist in bucket | ✅ Working |
| Public URL access | ✅ Working |
| Bucket listing API | ❌ Blocked (400 error) |
| Server connection | ✅ Working |

**Fix needed:** Enable file listing in bucket settings

---

## 🔐 Bucket Configuration Checklist

Go to: https://supabase.com/dashboard/project/klokwelpowqixscecakh/storage/buckets/eco-village-images

Verify these settings:

- [ ] Public bucket: **ON**
- [ ] File size limit: **10MB** (or higher)
- [ ] Allowed MIME types: `image/*` or specific types
- [ ] **Enable file listing/directory browsing**

---

## 🆘 If Still Not Working

### Option 1: Recreate Bucket with Correct Settings

1. Download all images from current bucket
2. Delete `eco-village-images` bucket
3. Create new bucket with these settings:
   - Name: `eco-village-images`
   - Public: ✅ YES
   - File listing: ✅ ENABLED
4. Re-upload all images

### Option 2: Use Different Storage Structure

If listing can't be enabled, we can hardcode the known image paths, but this is not ideal.

---

## 📝 Expected Folder Structure

Once listing works, the API should discover:

```
images/
├── Agricultural Hub/
│   ├── current/ (or Current/)
│   └── vision/ (or Vision/)
├── Ceremonial Infrastructure/
│   ├── current/
│   └── vision/
├── Tropical Dome Greenhouse/
│   ├── current/
│   └── vision/
...and 16 more zones
```

---

## ✅ After Fix

Once listing is enabled, all images will load automatically on the map! 🎉

Test with:
```
http://localhost:5001
```

Click any zone → Images should appear in Current/Vision tabs!

---

**Action Required:** Enable file listing in Supabase bucket settings
