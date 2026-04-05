# 🚀 GitHub Actions - Debugging Guide

## 📝 What We Created

Your GitHub Actions workflow is now set up at `.github/workflows/main.yml`

This workflow automatically runs **every time you push to `main` branch**.

---

## 🔍 How to Check Workflow Status

### Check Workflow Results:
1. Go to: **https://github.com/RitikRai07/Zorvyn-Assessment**
2. Click the **"Actions"** tab
3. You'll see your workflow runs
4. Click the run to see detailed logs

---

## 📊 What Each Step Does

### ✅ Step 1: Checkout Code
Pulls your latest code from GitHub

### ✅ Step 2: Setup Node.js
Installs Node.js 18.x (same as your local setup)

### ✅ Step 3: Debug - System Info
Shows:
- Node version
- NPM version  
- Current directory structure
- Available files

**Output looks like:**
```
🔍 System Information
====================
Node version: v18.x.x
NPM version: 9.x.x
PWD: /home/runner/work/Zorvyn-Assessment/Zorvyn-Assessment
📁 Directory structure:
[lists all files]
```

### ✅ Step 4: Check Permissions
Verifies all required config files are present:
- `package.json` ✓
- `tsconfig.json` ✓
- `next.config.mjs` ✓

### ✅ Step 5: Install Dependencies
Runs: `npm ci --prefer-offline --no-audit`

This installs all npm packages from `package.json`

### ✅ Step 6: Show Installed Packages
Lists what packages were installed (debugging)

### ✅ Step 7: Lint Check
Runs: `npm run lint`

Checks code quality (not required, continues on error)

### ✅ Step 8: Build App
**MOST IMPORTANT STEP** 

Runs: `npm run build`

This compiles your Next.js app to production build

### ✅ Step 9: Show Build Output
Lists what was created in `.next/` folder

### ✅ Step 10: Success/Failure
Shows final status with summary

---

## 🐛 Common Errors & Fixes

### Error 1: "Module Not Found"
```
❌ Error: Cannot find module 'react'
```

**Fix**: Make sure `npm install` ran successfully
- Check Step 5 logs
- Ensure `node_modules` created

### Error 2: "TypeScript Errors"
```
❌ Error: Type 'X' is not assignable to type 'Y'
```

**Fix**: 
- Run locally: `npm run build`
- Fix the TypeScript error
- Push again

### Error 3: "YAML Syntax Error"
```
❌ Error parsing workflow YAML
```

**Fix**: Check `.github/workflows/main.yml`
- Use 2 spaces (NOT tabs)
- Check indentation carefully

### Error 4: "Permission Denied"
```
❌ Permission denied
```

**Fix**: If deploying, check:
- Repo Settings → Secrets → Add required secrets
- Environment variables for API keys

### Error 5: "Build Failed"
```
❌ npm ERR! code BUILDTIME_ERROR
```

**Check the logs** - Scroll to Step 8: "Build Next.js application"
Look for the red error message

---

## 🔧 Debug Steps in Action

Our workflow includes powerful debug steps. When something fails:

### Debug Step Shows:
✓ Node version (must be 18+)
✓ NPM version  
✓ All files in directory
✓ Package.json validity
✓ node_modules status

**This helps identify 90% of issues!**

---

## 📋 Quick Checklist Before Push

Before pushing code:

- [ ] Run locally: `npm run build` ✓
- [ ] No TypeScript errors: `npm run build` passes
- [ ] `.github/workflows/main.yml` exists
- [ ] YAML has 2-space indentation
- [ ] package.json has `build` script

---

## 🚀 How to Push & Trigger Workflow

```bash
# Make your changes
git add .

# Commit
git commit -m "Your message"

# Push to main (this triggers workflow!)
git push origin main
```

**That's it!** The workflow automatically runs.

---

## 📍 View Workflow Status

### Real-time View:
1. GitHub → Actions tab
2. See "CI/CD Build & Deploy" running
3. Yellow 🟡 = running
4. Green ✅ = success
5. Red ❌ = failed

### Detailed Logs:
Click on the workflow → See each step
Each step shows:
- Time taken
- Command run
- Output/errors

---

## 💡 Pro Tips

### Tip 1: Always Check Logs
The logs tell you exactly what failed. Look for:
- Red error messages
- Stack traces
- Missing files

### Tip 2: Test Locally First
Before pushing:
```bash
npm run build
npm run start
```

If it works locally, it'll work in CI!

### Tip 3: Read Error Messages
Error messages are your friend:
```
❌ ERROR: Cannot find type definition for 'node'
FIX: npm install --save-dev @types/node
```

### Tip 4: Check Step 12 (Failure Info)
When build fails, Step 12 shows:
- Last 50 lines of error
- TypeScript errors
- Common issues checklist

---

## 🎯 Next Steps

### Option 1: Add Deployment
Uncomment the `deploy` job at bottom of `.github/workflows/main.yml` to deploy to hosting after build succeeds.

### Option 2: Add More Tests
Add to workflow:
```yaml
- name: Run tests
  run: npm run test
```

### Option 3: Deploy to Vercel
Add Vercel action for automatic deployment.

---

## 📞 Quick Reference

| Command | Does |
|---------|------|
| `git push origin main` | Triggers workflow |
| Check Actions tab | See workflow status |
| Click failed run | View detailed error logs |
| Fix error locally | Test with `npm run build` |
| Push again | Reruns workflow |

---

## ✨ You're All Set!

Your GitHub Actions workflow is ready to:
✅ Automatically build on every push
✅ Show detailed debug information
✅ Catch errors early
✅ Keep your code quality high

**Happy coding!** 🚀
