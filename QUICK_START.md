# Quick Start - 5 Minutes

## Prerequisites
- Node.js 18+ installed
- Firebase account (free)

## Setup

### 1. Get Firebase Credentials (2 min)
- Go to [Firebase Console](https://console.firebase.google.com/)
- Create new project: **CampusConnect**
- Register web app (click `</>` icon)
- Copy your config

### 2. Add Environment Variables (1 min)
Create `.env.local` in project root:
\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
\`\`\`

### 3. Enable Authentication (1 min)
In Firebase Console:
- Go to **Authentication**
- Click **Sign-in method**
- Enable **Email/Password**
- Click **Save**

### 4. Create Firestore Database (1 min)
In Firebase Console:
- Go to **Firestore Database**
- Click **Create database**
- Choose **Production mode**
- Select region → **Create**
- Go to **Rules** tab, replace with rules from `SETUP_GUIDE.md`
- Click **Publish**

### 5. Run App (0 min)
\`\`\`bash
npm run dev
\`\`\`

Open `http://localhost:3000` - you're done! 🎉

## Test It

1. Click **Sign Up**
2. Create account:
   - Name: Test User
   - Email: test@example.com
   - Password: Test@123456
   - Role: **Student**
   - Department: **CSE**
3. You're in! See your role-based dashboard

## What's Different Per Role?

**Student Dashboard:**
- Campus Points & Rewards
- Resource Booking
- Connect Hub

**Faculty Dashboard:**
- Event Approvals
- Resource Approvals

**Admin Dashboard:**
- All Features
- Full System Access

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "Firebase not initialized" | Check `.env.local` has all 6 variables, restart `npm run dev` |
| "Permission denied" | Check Firestore Rules are published correctly |
| Signup doesn't work | Password must be 6+ characters |
| Can't sign in | Wait 5 seconds, try again in incognito mode |

👉 For detailed setup, see `SETUP_GUIDE.md`
