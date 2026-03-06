# Nepal Election OSINT Dashboard - GitHub & Vercel Deployment

## Step 1: Install Git

Download from https://git-scm.com and install.

## Step 2: Initialize Git Repository

Open terminal in your project folder and run:

```bash
git init
git add .
git commit -m "Initial commit: Nepal Election OSINT Dashboard"
```

## Step 3: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `nepal-election-osint`
3. Click "Create repository"
4. Copy the commands shown (will be something like):

```bash
git remote add origin https://github.com/YOUR_USERNAME/nepal-election-osint.git
git branch -M main
git push -u origin main
```

## Step 4: Deploy to Vercel

### Option A: From GitHub (Recommended)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New..." → "Project"
4. Import your `nepal-election-osint` repository
5. Click "Deploy"

### Option B: Using Vercel CLI

```bash
npm i -g vercel
vercel login
vercel
```

## Step 5: Environment Variables (Optional)

If you want to add Mapbox for enhanced maps:

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to "Environment Variables"
4. Add: `NEXT_PUBLIC_MAPBOX_TOKEN=your_token`

## Quick Commands Summary

```bash
# After installing git
git init
git add .
git commit -m "Initial commit"

# Connect to GitHub (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/nepal-election-osint.git
git branch -M main
git push -u origin main

# Deploy to Vercel
npm i -g vercel
vercel login
vercel --prod
```

## Project is ready at:

- GitHub: https://github.com/YOUR_USERNAME/nepal-election-osint
- Vercel: https://nepal-election-osint.vercel.app (after deployment)
