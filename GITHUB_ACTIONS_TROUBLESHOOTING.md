# 🔧 GitHub Actions - Troubleshooting Checklist

## ⚠️ Workflow Failed? Use This Checklist

### Step 1: Go to Actions & Find Failed Run
1. GitHub Repo → **Actions** tab
2. Click the failed workflow with ❌
3. Click the failed job
4. **Scroll to find the red error message**

---

## 🔴 Most Common Errors

### ❌ Error: "npm ERR! code ENUMETARGETS"
```
npm ERR! code ENUMETARGETS
npm ERR! errno ENUMETARGETS
```

**Cause**: Package.json or package-lock.json has issues

**Fix**:
```bash
# Locally run:
rm -rf node_modules package-lock.json
npm install
git add .
git commit -m "Fix package-lock"
git push origin main
```

---

### ❌ Error: "Cannot find module"
```
Error: Cannot find module '/path/to/file'
```

**Cause**: TypeScript/JavaScript file missing or import path wrong

**Fix**:
1. Check import path is correct
2. File actually exists
3. Run locally: `npm run build`

---

### ❌ Error: "Type 'X' is not assignable to type 'Y'"
```
TypeScript Error:
Type 'string' is not assignable to type 'number'.
  at /path/to/file.tsx:42
```

**Cause**: TypeScript type mismatch in your code

**Fix**:
1. Read error location (file and line number)
2. Open that file
3. Fix the type issue
4. Run `npm run build` locally to verify
5. Push again

---

### ❌ Error: "SyntaxError"
```
SyntaxError: Unexpected token
  at /path/to/file.tsx:10:5
```

**Cause**: Invalid JavaScript/TypeScript syntax

**Fix**:
1. Open file at line 10
2. Check for missing commas, brackets, quotes
3. Compare with working code nearby

---

### ❌ Error: "EACCES: permission denied"
```
EACCES: permission denied
```

**Cause**: File permission issue (rare)

**Fix**:
```bash
# Locally:
git config core.filemode false
git add .
git commit -m "Fix permissions"
git push origin main
```

---

### ❌ Error: Node version mismatch
```
Error: Required Node version not met
```

**Fix**: In `.github/workflows/main.yml` change:
```yaml
node-version: 18  # Change to your version
```

Check your local node version:
```bash
node --version  # e.g., v18.17.0
```

---

## 📊 Debug Workflow Steps

### Step by Step Analysis

#### ❌ Failed at: "Setup Node.js"
```
Error setting up Node 18.x
```
**Likely cause**: Ubuntu version issue
**Fix**: Update actions/setup-node@v4

#### ❌ Failed at: "Install Dependencies"
```
npm ERR! 404 Not Found
```
**Likely cause**: NPM package not found
**Fix**: Check package.json dependencies are valid

#### ❌ Failed at: "Build Next.js Application"
```
error - failed to load next.config.mjs
```
**Likely cause**: next.config.mjs has syntax error
**Fix**: Run `node next.config.mjs` locally to test

#### ❌ Failed at: "Lint Check"
```
error - ESLint configuration error
```
**Likely cause**: .eslintrc.json missing or invalid
**Fix**: Create proper ESLint config

---

## 🔧 Quick Local Testing

Before pushing to GitHub, always test locally:

```bash
# Step 1: Install deps
npm install

# Step 2: Check TypeScript  
npm run build

# Step 3: Run locally
npm run dev

# Test at: http://localhost:3000
```

If these work locally → workflow will work!

---

## 🚀 Advanced Debugging

### Add More Debug Info to Workflow

If needed, add this to `.github/workflows/main.yml`:

```yaml
- name: Debug - Full file tree
  run: |
    echo "📁 Full repository structure:"
    find . -type f -name "*.tsx" -o -name "*.ts" | head -20
    echo ""
    echo "📝 package.json dependencies:"
    cat package.json | grep -A 20 '"dependencies"'
```

---

### Check for Hidden Issues

```yaml
- name: Validate configuration files
  run: |
    # Check JSON validity
    jq . package.json > /dev/null
    echo "✅ package.json is valid JSON"
    
    # Check TypeScript config
    [[ -f tsconfig.json ]] && echo "✅ tsconfig.json exists" || echo "❌ tsconfig.json missing"
    
    # Check Next config
    [[ -f next.config.mjs ]] && echo "✅ next.config.mjs exists" || echo "❌ next.config.mjs missing"
```

---

## 📝 File Checklist

Make sure these files exist in repo root:

- [ ] `package.json` - Node dependencies
- [ ] `package-lock.json` - Lock file (commit this!)
- [ ] `tsconfig.json` - TypeScript config
- [ ] `next.config.mjs` - Next.js config  
- [ ] `.eslintrc.json` - Linting config (optional)
- [ ] `.gitignore` - Git ignore file
- [ ] `app/` - Next.js app directory
- [ ] `.github/workflows/main.yml` - GitHub Actions (newly created)

---

## 🐛 Debugging in Real-Time

### Watch Workflow Run

1. Push your code: `git push origin main`
2. Go to Actions tab
3. Click the running workflow (yellow 🟡)
4. Expand each step to see output in real-time

### Follow Each Step

- Step 1-2: Should be quick
- Step 3-4: Shows environment info  
- Step 5: Should install npm packages
- Step 8: The important one - **Next.js build**
- Step 12: Shows success/failure summary

---

## 💡 Pro Debugging Tips

### Tip 1: Run npm ci Instead of npm install
GitHub Actions uses:
```bash
npm ci --prefer-offline --no-audit
```

This is better than `npm install` because it:
- Uses exact versions from package-lock.json
- Faster in CI environments
- More reliable

### Tip 2: Check Logs Immediately
GitHub keeps logs for 90 days, but better to check immediately:
- Logs are easier to understand fresh
- You remember what you changed

### Tip 3: Use Console Output
Our workflow has extensive logging:
```yaml
- name: Example Step
  run: |
    echo "🔍 Debug info here"
    echo "=== Configuration ==="
    NODE_VERSION=$(node --version)
    echo "Node: $NODE_VERSION"
```

The `echo` statements help debug!

### Tip 4: Compare With Local
If workflow fails but local works:
- Check Node version: `node --version`
- Check NPM version: `npm --version`
- Check OS: Windows vs Ubuntu Linux differences

---

## ✅ Success Checklist

When workflow shows ✅:

```
✓ Code checked out
✓ Node.js configured  
✓ Dependencies installed
✓ Next.js application built
✓ Ready for deployment
```

All 5 should be green!

---

## 🎯 What Happens on Success

Once workflow passes:
1. ✅ Code successfully built
2. ✅ No TypeScript errors
3. ✅ All dependencies resolved
4. ✅ Next.js production build created

You can now deploy to hosting!

---

## 📞 Still Need Help?

Check in this order:
1. **Read the error message** - It usually tells you the fix
2. **Check Step 12** - "Build Failed - Debug Info" has common issues
3. **Run locally** - `npm run build` will show same error
4. **Check file structure** - Ensure all files exist and are committed

---

## 🚀 You've Got This!

Remember:
- ✅ Always test locally first
- ✅ Push to GitHub
- ✅ Check Actions tab for results
- ✅ Fix any errors
- ✅ Push again

**Workflow will handle everything else!**
