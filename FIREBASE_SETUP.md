# Firebase Setup Guide

## Overview
This CampusConnect app uses Firebase for authentication and database storage. Follow these steps to configure Firebase.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name (e.g., "CampusConnect")
4. Continue through the setup wizard
5. Click "Create project"

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **Get Started**
3. Click on **Email/Password** provider
4. Enable it and save

## Step 3: Create Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a region closest to you
5. Click **Enable**

## Step 4: Get Your Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click **Web** icon (or create if needed)
4. Copy the entire config object (looks like this):

\`\`\`javascript
const firebaseConfig = {
  apiKey: "AIzaSyDxxxxxxxx...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxxxxx"
};
\`\`\`

## Step 5: Add to Environment Variables

1. Create a `.env.local` file in your project root (same level as `package.json`)
2. Add these variables (replace with your actual values):

\`\`\`
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
\`\`\`

3. **Important:** These variables MUST start with `NEXT_PUBLIC_` to work in the browser

## Step 6: Restart Development Server

\`\`\`bash
npm run dev
\`\`\`

Then refresh your browser. The app should now work!

## Firestore Security Rules (for production)

Replace the default rules with:

\`\`\`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
      allow create: if request.auth.uid == userId;
    }
  }
}
\`\`\`

## Troubleshooting

**Error: "auth/invalid-api-key"**
- Check that `.env.local` exists and has all Firebase variables
- Make sure variables start with `NEXT_PUBLIC_`
- Restart dev server after adding variables

**Error: "Missing or insufficient permissions"**
- Your Firestore database is in production mode
- Switch to test mode or update security rules

**Can't sign up**
- Go to Firebase Console > Authentication > Settings
- Make sure Email/Password provider is enabled

---

For more help, visit [Firebase Docs](https://firebase.google.com/docs)
