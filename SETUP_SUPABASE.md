# 🔧 Supabase Setup - Fix Image Loading Issue

## ❌ **Current Problem**

Images are not loading because Supabase credentials are not configured.

**Current values in code:**
```javascript
SUPABASE_URL = 'https://your-project.supabase.co'  // ❌ Placeholder
SUPABASE_ANON_KEY = 'your-anon-key'                // ❌ Placeholder
```

---

## ✅ **Solution: Configure Your Supabase Credentials**

### **Step 1: Get Your Supabase Credentials**

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Click on **⚙️ Project Settings** (bottom left)
4. Click on **API** in the sidebar
5. You'll see two values:

**Project URL:** `https://xxxxxxxxxxxxx.supabase.co`  
**anon/public key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long string)

---

### **Step 2: Create .env File**

Run this PowerShell command in your project folder:

```powershell
# Navigate to project folder
cd "f:\AI apps & websites\EcoVillageBuilder\EcoVillageBuilder"

# Create .env file with your credentials
@"
SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
SUPABASE_ANON_KEY=YOUR-ANON-KEY-HERE
SUPABASE_BUCKET=eco-village-images
"@ | Out-File -FilePath .env -Encoding utf8
```

**Replace:**
- `YOUR-PROJECT-ID` with your actual project ID
- `YOUR-ANON-KEY-HERE` with your actual anon key

---

### **Step 3: Verify .env File Exists**

```powershell
# Check if .env file exists
Test-Path .env

# View contents (optional)
Get-Content .env
```

**Expected output:**
```
SUPABASE_URL=https://your-actual-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUz...
SUPABASE_BUCKET=eco-village-images
```

---

### **Step 4: Restart Server**

```powershell
# Kill existing Node processes
.\kill-node.ps1

# Start server
npm run dev
```

---

## 🧪 **Test If It's Working**

### **Test 1: Check Server Reads .env**

After restarting, the server should NOT show placeholder values.

**Check console output:**
```
✅ Good: Server connects to Supabase
❌ Bad: "Error fetching Supabase" or 404 errors
```

### **Test 2: Test API Endpoint Directly**

Open in browser:
```
http://localhost:5001/api/images/tropical-dome-greenhouse/current
```

**Expected response:**
```json
{
  "success": true,
  "zoneId": "tropical-dome-greenhouse",
  "images": [
    "https://your-project.supabase.co/storage/v1/object/public/eco-village-images/..."
  ],
  "count": 5
}
```

**If you get empty array:**
```json
{
  "success": true,
  "images": [],
  "count": 0
}
```
This means Supabase is connected but folder is empty or named wrong.

---

## 📁 **Verify Supabase Bucket Setup**

### **Check Bucket Exists:**

1. Go to **Storage** in Supabase dashboard
2. You should see a bucket named: `eco-village-images`
3. Click on it

### **Check Bucket is Public:**

1. Click on bucket settings (⚙️ icon)
2. Ensure **Public bucket** is ✅ **enabled**
3. If not, enable it and save

### **Check Folder Structure:**

Inside `eco-village-images` bucket, you should see:

```
eco-village-images/
├── Agricultural Hub/
│   ├── Current/
│   │   └── (images here)
│   └── Vision/
│       └── (images here)
├── Tropical Dome Greenhouse/
│   ├── Current/
│   │   └── (images here)
│   └── Vision/
│       └── (images here)
├── Events & Gatherings Hub/
│   ├── Current/
│   └── Vision/
...etc
```

**Important:**
- ✅ Folder names MUST match exactly (case-sensitive!)
- ✅ Each zone needs `Current` and `Vision` subfolders
- ✅ Images go INSIDE those subfolders

---

## 🐛 **Common Issues & Fixes**

### **Issue 1: "Cannot find module 'dotenv'"**

**Fix:**
```powershell
npm install dotenv
```

### **Issue 2: .env file not being read**

**Check:** Is dotenv configured in server-complete.js?

Look for this at the top:
```javascript
import dotenv from 'dotenv';
dotenv.config();
```

If missing, add it right after the imports.

### **Issue 3: Images still not loading**

**Test Supabase URL directly in browser:**
```
https://YOUR-PROJECT.supabase.co/storage/v1/object/public/eco-village-images/Tropical%20Dome%20Greenhouse/Current/tropical-dome-greenhouse-current-1.jpg
```

**If 404:** Folder or file doesn't exist  
**If 403:** Bucket not public  
**If works:** Server .env configuration issue  

---

## 🔐 **Security Note**

**NEVER commit .env file to Git!**

The .env file is already in .gitignore, so it won't be committed.

**For deployment (Vercel):**
1. Go to Vercel project settings
2. Add Environment Variables:
   - `SUPABASE_URL` = your URL
   - `SUPABASE_ANON_KEY` = your key
   - `SUPABASE_BUCKET` = eco-village-images

---

## ✅ **Quick Fix Script**

Copy and run this (replace with YOUR values):

```powershell
# Create .env file with your actual Supabase credentials
@"
SUPABASE_URL=https://YOUR-PROJECT.supabase.co
SUPABASE_ANON_KEY=YOUR-ACTUAL-ANON-KEY
SUPABASE_BUCKET=eco-village-images
"@ | Out-File -FilePath ".env" -Encoding utf8 -Force

# Restart server
.\kill-node.ps1
npm run dev

# Test
Start-Process "http://localhost:5001"
```

---

## 📞 **Still Not Working?**

### **Debug Checklist:**

- [ ] .env file exists in project root
- [ ] .env contains real Supabase credentials (not placeholders)
- [ ] Supabase bucket named "eco-village-images"
- [ ] Bucket is public
- [ ] Folders uploaded to Supabase
- [ ] Folder names match exactly
- [ ] Current/Vision subfolders exist
- [ ] Images are inside subfolders
- [ ] Server restarted after creating .env
- [ ] No firewall blocking Supabase

### **Test Individual Steps:**

```powershell
# 1. Check .env exists
Get-Content .env

# 2. Check environment variables loaded
# (After starting server, check console for Supabase messages)

# 3. Test API
Invoke-WebRequest http://localhost:5001/api/images/tropical-dome-greenhouse/current | Select-Object -Expand Content

# 4. Test Supabase directly
# Open browser: https://YOUR-PROJECT.supabase.co/storage/v1/object/list/eco-village-images?prefix=Tropical%20Dome%20Greenhouse/Current
```

---

**Once .env is configured with real credentials, images will load!** 🚀
