# CampusConnect - Firebase Authentication & Role-Based Dashboard

A complete campus management system with Firebase authentication and role-based dashboards for Students, Faculty, and Admin.

## Quick Setup Guide

### 1. Install Dependencies
\`\`\`bash
npm install firebase
\`\`\`

### 2. Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project called "CampusConnect"
3. Click "Add app" and select "Web"
4. Copy your Firebase config values
5. Create a `.env.local` file in your project root (copy from `.env.example`)
6. Paste your Firebase credentials:

\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
\`\`\`

### 3. Setup Firestore Database

1. In Firebase Console, go to **Firestore Database** → Create Database
2. Choose "Start in production mode"
3. Select your preferred region
4. Replace the default rules with these rules (Firestore → Rules):

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - each user can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Events collection - students can read, faculty/admin can create
    match /events/{eventId} {
      allow read: if request.auth != null;
      allow create, update, delete: if 
        request.auth != null && 
        (request.resource.data.role == 'Faculty' || request.resource.data.role == 'Admin');
    }
    
    // Requests collection - anyone authenticated can read/write
    match /requests/{requestId} {
      allow read, write: if request.auth != null;
    }
    
    // Resources collection - anyone authenticated can read/write
    match /resources/{resourceId} {
      allow read, write: if request.auth != null;
    }
  }
}
\`\`\`

### 4. Enable Authentication

In Firebase Console:
1. Go to **Authentication** → Sign-in method
2. Enable **Email/Password** provider
3. Enable **Google** (optional, for social login later)

### 5. Start the App

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` and sign up with a role (Student, Faculty, or Admin).

## Features

✅ **Role-Based Authentication**
- Student Portal: Dashboard, Gamification, Resource Booking, Connect Hub
- Faculty Portal: Event Approvals, Resource Approvals, Student Management
- Admin Portal: System Management, All Approvals

✅ **Student Features**
- Campus Dashboard with feed
- Gamification system (points, badges, rewards)
- Resource booking (books, equipment, rooms, halls)
- Connect Hub for networking

✅ **Faculty Features**
- Event request approvals
- Resource request management
- Student activity monitoring

✅ **Admin Features**
- Full system oversight
- User management
- All approval workflows

## File Structure

\`\`\`
app/
├── page.tsx                    # Entry point with Firebase Provider
├── layout.tsx                  # Root layout
├── globals.css                 # Global styles
contexts/
├── FirebaseAuthContext.tsx    # Firebase auth logic (signup, signin, logout)
components/
├── AuthWrapper.tsx            # Auth state + role-based routing
├── LoginForm.tsx              # Original demo login (optional)
├── SigninForm.tsx             # Firebase signin form
├── SignupForm.tsx             # Firebase signup with role selection
├── CampusMain.tsx             # Main app dashboard (all features)
lib/
├── firebase.ts                # Firebase initialization
├── constants.ts               # Mock data
├── types.ts                   # TypeScript interfaces
\`\`\`

## User Data Structure (Firestore)

Each user document in `/users/{uid}` contains:

\`\`\`typescript
{
  id: string              // Firebase UID
  email: string
  name: string
  role: 'student' | 'faculty' | 'admin'
  department: string      // e.g., "Computer Science", "IT"
  points: number          // Campus points (for gamification)
  rank: number            // Leaderboard rank
  badges: string[]        // Earned badges
  createdAt: string       // ISO timestamp
}
\`\`\`

## Testing

### Test User Credentials

After signup, use these test accounts:

**Student Account:**
- Email: student@test.com
- Password: Test@123
- Role: Student
- Department: CSE

**Faculty Account:**
- Email: faculty@test.com
- Password: Test@123
- Role: Faculty
- Department: IT

**Admin Account:**
- Email: admin@test.com
- Password: Test@123
- Role: Admin
- Department: Management

## Troubleshooting

### "Firebase API not initialized"
- Check your `.env.local` file has correct Firebase credentials
- Restart dev server: `npm run dev`

### "Permission denied" errors
- Verify Firestore rules are set correctly
- Check user is authenticated (should see login screen if not)

### "User data not loading"
- Ensure user document exists in Firestore
- Check user is signed in (look for profile in FirebaseAuthContext)

## Next Steps

1. **Email Verification**: Add email verification in SignupForm
2. **Social Auth**: Add Google/GitHub OAuth
3. **Profile Image**: Add photo upload with Firebase Storage
4. **Notifications**: Set up Firebase Cloud Messaging
5. **Database Sync**: Move all mock data to Firestore

## Support

For issues or questions about the setup, refer to:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)
\`\`\`

```tsx file="" isHidden
