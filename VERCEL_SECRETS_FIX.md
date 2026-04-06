# ✅ GitHub Secrets Setup Guide - CRITICAL FIX

## 🔴 Current Issue

Your GitHub Actions workflow is FAILING because the Vercel deployment secrets are missing:

```
Error: Input required and not supplied: vercel-token
```

---

## ✅ SOLUTION: Add GitHub Secrets (5 Minutes)

### Step 1: Go to Your Repository Settings

1. Go to: https://github.com/YOUR_USERNAME/Zorvyn
2. Click **Settings** (top right)
3. Left sidebar → **Secrets and variables** → **Actions**

### Step 2: Create Secret #1: VERCEL_TOKEN

1. Click **New repository secret**
2. **Name**: `VERCEL_TOKEN`
3. **Value**: 
   - Go to: https://vercel.com/account/tokens
   - Click **Create**
   - Copy the token
   - Paste into GitHub secret field
4. Click **Add secret**

### Step 3: Create Secret #2: VERCEL_ORG_ID

1. Click **New repository secret**
2. **Name**: `VERCEL_ORG_ID`
3. **Value**:
   - Go to: https://vercel.com/dashboard/settings/team
   - Copy **Team ID**
   - Paste into GitHub secret field
4. Click **Add secret**

### Step 4: Create Secret #3: VERCEL_PROJECT_ID

1. Click **New repository secret**
2. **Name**: `VERCEL_PROJECT_ID`
3. **Value**:
   - Go to Vercel Dashboard → Your Project
   - Go to **Settings** → **General**
   - Copy **Project ID**
   - Paste into GitHub secret field
4. Click **Add secret**

---

## ✅ Verification Checklist

After adding the secrets, verify they're correct:

- [ ] VERCEL_TOKEN - Should look like: `eyJhbGciOiJIUzI1NiIsInR5cCI6I...` (starts with eyJ)
- [ ] VERCEL_ORG_ID - Should look like: `team_xxxxxxxxxxxxxxxxxxxxx` or `user_xxxxxxxxxxxxxxxxxxxxx`
- [ ] VERCEL_PROJECT_ID - Should look like: `prj_xxxxxxxxxxxxxxxxxxxxx`

---

## 🚀 Test the Fix

### Option 1: Push a Commit (Automatic)
```bash
git add .
git commit -m "ci: configure vercel secrets"
git push origin main
```

Then check: https://github.com/YOUR_USERNAME/Zorvyn/actions

You should see ✅ **Build** and ✅ **Deploy** both passing!

### Option 2: Manual Trigger (Faster)
1. Go to GitHub Repo → **Actions** tab
2. Click **CI/CD Build & Deploy** (left sidebar)
3. Click **Run workflow** → **Run workflow**
4. Wait 2-3 minutes

---

## 📋 If Deployment Still Fails

### Check 1: Secrets are Actually Saved
1. Settings → Secrets → Actions
2. You should see 3 green checkmarks next to the secrets
3. If they're grayed out or showing "X", they weren't saved

### Check 2: Workflow Syntax
1. Run locally: `npm run build`
2. Should complete without errors

### Check 3: Check GitHub Actions Logs
1. Go to failing workflow
2. Click the **Deploy to Vercel** step
3. Look for the actual error message

---

## 🎯 What Should Happen After Fix

1. **Push to main** → GitHub Actions automatically runs
2. **Build job** ✅ Installs dependencies, runs TypeScript checks, builds Next.js
3. **Deploy job** ✅ Uses Vercel secrets to deploy to `zorvyn-assessment.vercel.app`
4. **Success** 🎉 Website is live!

You can then deploy future updates by just pushing to `main` branch!

---

## 🔒 Security Notes

- GitHub secrets are **encrypted** and **private**
- Only used by GitHub Actions
- Cannot be viewed after creation
- You can only **replace** or **delete** them
- Never commit secrets to Git!

---

## 📞 Troubleshooting

**Problem**: Can't find VERCEL_TOKEN in vercel.com account
**Solution**: Make sure you're logged into the correct Vercel account (same one hosting your project)

**Problem**: VERCEL_ORG_ID shows as "username" not team ID
**Solution**: If you're on free tier (personal account), use your username instead

**Problem**: Project ID not found
**Solution**: Make sure the project exists in Vercel. If not, import it via: https://vercel.com/import
