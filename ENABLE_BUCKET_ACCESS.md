# 🔓 Enable Bucket File Listing - Correct Steps

## Where You Are Now
You're on the **general Storage Settings** page. That's not where we need to be!

---

## ✅ Go to the RIGHT Place

### **Step 1: Navigate to Bucket Policies**

Click on these in order:

1. **Storage** (left sidebar)
2. Click on **`eco-village-images`** bucket name
3. Look for **"Policies"** tab or button
4. Or go directly to: **Storage** → **Policies** (in left sidebar)

**Direct link:**
```
https://supabase.com/dashboard/project/klokwelpowqixscecakh/storage/policies
```

---

## 🔧 Option 1: Add Storage Policy (Recommended)

### **In the Policies section:**

1. Click **"New Policy"**
2. Choose **"For full customization"** 
3. Add this policy:

**Policy Name:** `Allow public file listing`  
**Policy Definition:**

```sql
-- Allow anonymous users to SELECT (list/read) from eco-village-images
CREATE POLICY "Public read access"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'eco-village-images'
);
```

4. Click **"Review"** then **"Save"**

---

## 🔧 Option 2: Use SQL Editor (Faster)

1. Go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Paste this:

```sql
-- Enable public read access for eco-village-images bucket
CREATE POLICY IF NOT EXISTS "Public Access"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'eco-village-images' );
```

4. Click **"Run"**

---

## 🔧 Option 3: Disable RLS (Quick but less secure)

If policies don't work, you can disable Row Level Security on the bucket:

1. Go to **SQL Editor**
2. Run this:

```sql
-- Disable RLS on storage.objects (allows all access)
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```

⚠️ **Warning:** This makes ALL buckets publicly listable. Only use if you're okay with that.

---

## 🔧 Option 4: Check Bucket Configuration

1. Go to **Storage** → **Buckets**
2. Find `eco-village-images`
3. Click the **three dots (⋮)** or **gear icon**
4. Make sure:
   - ✅ **Public bucket** is enabled
   - ✅ **Allowed MIME types** includes `image/*`

---

## 🧪 Test After Each Change

After adding a policy, test immediately:

```powershell
.\test-supabase-direct.ps1
```

Expected output after fix:
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

## 🆘 Alternative Solution (If Policies Don't Work)

If you can't get listing to work, I can create a hardcoded solution that doesn't require listing:

### **Option: Pre-defined Image List**

Since you know which zones exist, we can:
1. Manually list the expected images for each zone
2. The app tries to load each image
3. Only displays images that successfully load

**Would you like me to implement this?** It's less elegant but will work immediately.

---

## 📊 What We're Trying to Fix

**Current situation:**
```
Direct image URL: ✅ Works
https://...supabase.co/.../eco-village-images/images/Ceremonial%20Infrastructure/vision/ceremonie%20space.jpg

List API: ❌ 400 Bad Request  
https://...supabase.co/.../object/list/eco-village-images?prefix=images
```

**After fix:**
```
List API: ✅ Returns array of files
Server discovers images automatically
Map displays all ~400 images
```

---

## 🎯 Recommended Action

**Try in this order:**

1. **Go to Storage → Policies**
   - Add "Public read access" policy (see SQL above)

2. **Test:**
   ```powershell
   .\test-supabase-direct.ps1
   ```

3. **If still failing, try SQL Editor:**
   - Run the RLS disable command

4. **If STILL failing:**
   - Let me know and I'll implement the hardcoded solution

---

## 📞 Quick Links

- **Policies:** https://supabase.com/dashboard/project/klokwelpowqixscecakh/storage/policies
- **SQL Editor:** https://supabase.com/dashboard/project/klokwelpowqixscecakh/sql/new
- **Buckets:** https://supabase.com/dashboard/project/klokwelpowqixscecakh/storage/buckets

---

**Try adding the policy now and let me know if the test works!** 🚀
