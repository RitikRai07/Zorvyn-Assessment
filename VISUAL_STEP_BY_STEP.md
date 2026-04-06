# 🖼️ VISUAL STEP-BY-STEP GUIDE

## PART 1: Get Your Secrets from Vercel

### Step A: Get VERCEL_TOKEN

```
1. Open this link: https://vercel.com/account/tokens
   
2. Look for "Tokens" section on the page

3. Click the button: "Create Token" (usually blue)

4. A dialog appears:
   - Token name: type "github-zorvyn"
   - Expiration: select "7 days" (or "30 days")
   
5. Click: "Create" button

6. A long string appears - THIS IS YOUR TOKEN
   
7. COPY IT (select all, Ctrl+C)

8. SAVE IT in a temporary text file (Notepad)
```

**What it looks like**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ...` (very long)

---

### Step B: Get VERCEL_ORG_ID

```
1. Open: https://vercel.com/dashboard

2. Look for "Settings" (gear icon, usually top-left area)

3. Click "Settings"

4. In the Settings page, look for:
   - "Team" section, or
   - "Account" section
   
5. Look for one of these fields:
   - "Team ID"
   - "User ID" 
   - "ID" (whatever you see)
   
6. COPY IT
   
7. SAVE IT in your temporary text file
```

**What it looks like**: `team_abc123def456` or just your username like `john123`

---

### Step C: Get VERCEL_PROJECT_ID

```
1. Open: https://vercel.com/dashboard

2. You should see your projects listed

3. Click on: "Zorvyn" project (the one you're deploying)

4. Click: "Settings" (project settings, not account settings)

5. Look for: "Project ID" field

6. COPY IT

7. SAVE IT in your temporary text file
```

**What it looks like**: `prj_xyz789abc123` or `zorvyn-assessment` or similar

---

## PART 2: Add Secrets to GitHub (Web Interface)

### Step 1: Open Your GitHub Repo

```
URL: https://github.com/RitikRai07/Zorvyn-Assessment
```

---

### Step 2: Click Settings

```
You should see the top navigation:

[Code]  [Pull Requests]  [Actions]  [Settings] ← CLICK THIS

Settings is on the right side, gear icon usually
```

---

### Step 3: Find Secrets Section

```
You're now in Settings page.

Left sidebar (on the left side of page):
  
  Look for: "Security"
  
  Under Security, find: "Secrets and variables"
  
  Click: "Secrets and variables"
```

---

### Step 4: Expand "Actions"

```
After clicking "Secrets and variables":

You'll see: "Repository secrets" at the top
AND
Under that: Options including "Actions"

Click: "Actions"
```

---

### Step 5: Add First Secret (VERCEL_TOKEN)

```
You should see a blue button: "New repository secret"

Click: "New repository secret"

A form appears with 2 fields:

Field 1 - Name:
  Clear any existing text
  Type EXACTLY: VERCEL_TOKEN
  (all caps, no spaces, no dashes)

Field 2 - Value:  
  Paste your token from the text file
  (the very long string starting with eyJ...)

Click: "Add secret" button

✅ Success! You should see a green checkmark
```

---

### Step 6: Add Second Secret (VERCEL_ORG_ID)

```
Click: "New repository secret" again

Field 1 - Name:
  Type EXACTLY: VERCEL_ORG_ID
  (all caps, underscores)

Field 2 - Value:
  Paste your Org/Team ID from text file

Click: "Add secret" button

✅ Success! Green checkmark appears
```

---

### Step 7: Add Third Secret (VERCEL_PROJECT_ID)

```
Click: "New repository secret" one more time

Field 1 - Name:
  Type EXACTLY: VERCEL_PROJECT_ID
  (all caps, underscores)

Field 2 - Value:
  Paste your Project ID from text file

Click: "Add secret" button

✅ Success! Green checkmark appears
```

---

## VERIFICATION

```
After Step 7, you should see on the "Secrets" page:

✅ VERCEL_TOKEN              Updated 1 minute ago
✅ VERCEL_ORG_ID             Updated 1 minute ago  
✅ VERCEL_PROJECT_ID         Updated 1 minute ago

All 3 have GREEN CHECKMARKS ✅
```

---

## PART 3: Test Deployment

### Step 1: Go to Actions

```
In your GitHub repo:

Top navigation: [Code] [Pull Requests] [Actions] ← CLICK

Click: "Actions"
```

---

### Step 2: Find Failed Workflow

```
You should see a list of workflows:

Look for the RED ❌ one (the failed deployment)

Click on it
```

---

### Step 3: Re-run the Workflow

```
You should see workflow details

At the top right, look for: "Re-run failed jobs" or "Redo" button

Click: "Re-run failed jobs"

A dialog might appear, click: "Re-run"
```

---

### Step 4: Wait for Results

```
You'll see the workflow running:

Step 1: Set up job         ✓ (green)
Step 2: Checkout code      ✓ (green)
Step 3: Build Next.js      ✓ (green)
Step 4: Deploy to Vercel   ⏳ (running...)

Wait 3-5 minutes...

After waiting, you should see:

✅ build (20.x)   PASSED
✅ deploy        PASSED

And a message like:
"🎉 Deployment Successful!
Your website is now LIVE at:
https://zorvyn-Assessment.vercel.app"
```

---

## 🎉 SUCCESS!

```
Your site is now LIVE!

Every time you push to main branch:
- GitHub auto-builds
- GitHub auto-deploys
- Site updates in 5 minutes

No more manual deployment! 🚀
```

---

## 📸 QUICK REFERENCE

**Where to find Secrets in GitHub**:
```
GitHub Repo 
  ↓
Settings (gear, top right)
  ↓
Secrets and variables (left sidebar, under Security)
  ↓
Actions (click this option)
  ↓
New repository secret (blue button, top right)
```

**The exact 3 secret names**:
```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

(All caps, with underscores, no dashes, no spaces)

---

**Follow these steps exactly and it will definitely work!** ✅✨
