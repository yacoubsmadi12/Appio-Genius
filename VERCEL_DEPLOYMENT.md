# Vercel Deployment Guide

Your project is now configured for Vercel deployment! Here's how to deploy it:

## 🚀 Deployment Steps

### 1. Build Your Project Locally (Optional)
```bash
./build-for-vercel.sh
```
This ensures everything builds correctly before deploying.

### 2. Push to GitHub
```bash
git add .
git commit -m "Add Vercel deployment configuration"
git push origin main
```

### 3. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect the configuration

### 4. Set Environment Variables in Vercel
In your Vercel project dashboard:
1. Go to **Settings** > **Environment Variables**
2. Add these variables for **Production** environment:

| Name | Value |
|------|-------|
| `VITE_FIREBASE_API_KEY` | Your Firebase API Key |
| `VITE_FIREBASE_PROJECT_ID` | Your Firebase Project ID |
| `VITE_FIREBASE_APP_ID` | Your Firebase App ID |

**Important**: Make sure to select "Production" environment when adding these variables.

### 5. Deploy
Click "Deploy" - Vercel will:
- Use the build command: `vite build --config vite.config.vercel.ts`
- Output to: `dist/public`
- Deploy your frontend as a static site

## ⚙️ Configuration Details

The project includes:
- **`vercel.json`**: Deployment configuration
- **`vite.config.vercel.ts`**: Vercel-specific build configuration (excludes Replit plugins)
- **`build-for-vercel.sh`**: Local build script for testing

## 🔧 Troubleshooting

**Build Fails?**
- Run `./build-for-vercel.sh` locally to test
- Check that all environment variables are set in Vercel

**Firebase Errors?**
- Verify your Firebase environment variables are correct
- Make sure Firebase project allows your Vercel domain

**404 Errors?**
- The `vercel.json` already includes routing configuration for SPA
- All routes will serve `index.html` (handled automatically)

## 📱 Result

After deployment, your app will be available at a Vercel URL (like `your-project.vercel.app`) with:
- ✅ Full frontend functionality
- ✅ Firebase authentication
- ✅ Optimized static assets
- ✅ SPA routing support