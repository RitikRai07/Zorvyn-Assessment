# 💻 ALTERNATIVE: Add Secrets Using GitHub CLI (Command Line)

If you can't add secrets through the web interface, use this method instead.

---

## 📋 WHAT YOU NEED

1. GitHub CLI installed (most systems have it)
2. Your 3 secret values (see GITHUB_SECRETS_SIMPLE.md for how to get them)
3. Run commands in PowerShell/Terminal

---

## 🚀 METHOD A: Using GitHub CLI (Easiest)

### Step 1: Check if GitHub CLI is installed

```powershell
gh --version
```

If you see a version number, you have it! Continue to Step 2.

If you see "not found", install from: https://cli.github.com/

---

### Step 2: Make sure you're logged in

```powershell
gh auth login
```

Follow the prompts if needed.

---

### Step 3: Add the 3 secrets

Run these commands in PowerShell (replace placeholder values):

```powershell
# Secret 1: VERCEL_TOKEN
gh secret set VERCEL_TOKEN --body "YOUR_VERCEL_TOKEN_HERE"

# Secret 2: VERCEL_ORG_ID  
gh secret set VERCEL_ORG_ID --body "YOUR_ORG_ID_HERE"

# Secret 3: VERCEL_PROJECT_ID
gh secret set VERCEL_PROJECT_ID --body "YOUR_PROJECT_ID_HERE"
```

**Example** (with real values):
```powershell
gh secret set VERCEL_TOKEN --body "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ..."
gh secret set VERCEL_ORG_ID --body "team_abc123xyz789"
gh secret set VERCEL_PROJECT_ID --body "prj_xyz789abc123"
```

---

### Step 4: Verify secrets were added

```powershell
gh secret list
```

You should see:
```
VERCEL_TOKEN          Updated X minutes ago
VERCEL_ORG_ID         Updated X minutes ago
VERCEL_PROJECT_ID     Updated X minutes ago
```

✅ All done!

---

## 🎯 METHOD B: Copy-Paste Ready Commands

If you have your secret values, just copy and run these:

```powershell
# Change YOUR_VALUES to your actual values
gh secret set VERCEL_TOKEN --body "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ..." --repo RitikRai07/Zorvyn-Assessment
gh secret set VERCEL_ORG_ID --body "team_xxx" --repo RitikRai07/Zorvyn-Assessment
gh secret set VERCEL_PROJECT_ID --body "prj_xxx" --repo RitikRai07/Zorvyn-Assessment
```

---

## 🔄 Next: Test Deployment

After commands complete:

1. Go to GitHub Actions
2. Click latest failed workflow
3. Click "Re-run failed jobs"
4. Wait 5 minutes
5. Should see ✅ both jobs pass

---

## ⚠️ TROUBLESHOOTING

**Error: "not found" or "not installed"**
- Install GitHub CLI: https://cli.github.com/

**Error: "authentication required"**
- Run: `gh auth login`
- Follow the prompts

**Error: "could not create secret"**
- Make sure repo name is correct: `RitikRai07/Zorvyn-Assessment`
- Make sure you're logged in: `gh auth login`

---

## 💪 If You're in PowerShell

The commands work exactly the same way in PowerShell on Windows!

Just paste them directly into PowerShell and press Enter.

---

## ✨ DONE!

After running those 3 commands, all secrets are configured and deployment works!

No more manual GitHub web clicks needed. Everything is automatic! 🚀
