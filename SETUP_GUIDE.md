# Firebase Authentication Setup - Complete Guide

Follow these steps to get your CampusConnect app running with Firebase authentication.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Name it: `CampusConnect`
4. Accept the terms and click **"Continue"**
5. Disable Google Analytics (optional) and click **"Create project"**
6. Wait for the project to be created (2-3 minutes)

## Step 2: Register Your Web App

1. In your Firebase project, click the **Web icon** (`</>`) to register a web app
2. App name: `CampusConnect Web`
3. Check "Also set up Firebase Hosting for this app" (optional)
4. Click **"Register app"**
5. Copy the Firebase config - you'll see something like:

\`\`\`javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "yourproject.firebaseapp.com",
  projectId: "yourproject",
  storageBucket: "yourproject.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
\`\`\`

## Step 3: Add Environment Variables

1. In your project root, create a file named `.env.local` (or rename `.env.example`)
2. Add your Firebase credentials:

\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyD...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=yourproject.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=yourproject
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=yourproject.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456
\`\`\`

3. Save the file and restart your dev server: `npm run dev`

## Step 4: Enable Firebase Authentication

1. In Firebase Console, go to **Authentication** (left sidebar)
2. Click the **"Sign-in method"** tab
3. Click **"Email/Password"** provider
4. Toggle **"Enable"** to turn it on
5. Click **"Save"**

Your Firebase auth is now ready!

## Step 5: Create Firestore Database

1. In Firebase Console, go to **Firestore Database** (left sidebar)
2. Click **"Create database"**
3. Choose **"Start in production mode"** (we'll set rules next)
4. Select your preferred region (closest to you)
5. Click **"Create"**

## Step 6: Set Firestore Security Rules

1. Go to the **"Rules"** tab in Firestore
2. Replace the default rules with this:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - each user can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Events collection - authenticated users can read
    match /events/{eventId} {
      allow read: if request.auth != null;
      allow create, update, delete: if 
        request.auth != null && 
        (request.resource.data.createdByRole == 'faculty' || 
         request.resource.data.createdByRole == 'admin');
    }
    
    // Requests collection - all authenticated users
    match /requests/{requestId} {
      allow read, write: if request.auth != null;
    }
    
    // Resources collection - all authenticated users
    match /resources/{resourceId} {
      allow read, write: if request.auth != null;
    }
  }
}
\`\`\`

3. Click **"Publish"**

## Step 7: Test the Application

1. Start your dev server: `npm run dev`
2. Open `http://localhost:3000` in your browser
3. You should see the CampusConnect login screen
4. Click **"Sign Up"** and create a test account:

### Test Account 1 (Student):
- Name: `John Doe`
- Email: `student@test.com`
- Password: `Test@123456`
- Role: **Student**
- Department: `Computer Science`

### Test Account 2 (Faculty):
- Name: `Dr. Jane Smith`
- Email: `faculty@test.com`
- Password: `Test@123456`
- Role: **Faculty**
- Department: `Information Technology`

### Test Account 3 (Admin):
- Name: `Admin User`
- Email: `admin@test.com`
- Password: `Test@123456`
- Role: **Admin**
- Department: `Management`

5. After signup, you'll be automatically logged in and see the role-based dashboard

## Step 8: Verify Everything Works

Check these features work correctly:

### For Student Account:
- ✅ Dashboard shows "Campus Points"
- ✅ Can see "Campus Rewards" tab
- ✅ Can book resources (books, lab equipment, rooms)
- ✅ Can post on campus feed
- ✅ Can access Connect Hub
- ✅ Logout button works

### For Faculty Account:
- ✅ Can see "Approvals" tab
- ✅ Can approve/reject event requests
- ✅ Can approve/reject resource requests
- ✅ Dashboard shows faculty-specific view

### For Admin Account:
- ✅ Can see "Approvals" tab (same as faculty)
- ✅ Full system access
- ✅ All management features visible

## Troubleshooting

### Error: "Firebase app not initialized"
**Solution:** 
- Check `.env.local` file has all 6 Firebase credentials
- Make sure variable names start with `NEXT_PUBLIC_`
- Restart dev server: `npm run dev`

### Error: "Permission denied" in Firestore
**Solution:**
- Go to Firestore Rules and verify they match the code above
- Check that you're signed in (should see user profile in top right)
- Wait 60 seconds for rule changes to propagate

### User data not persisting after refresh
**Solution:**
- This is expected - we're using Firestore but data needs to be saved
- The app currently uses local state for demo purposes
- To persist data to Firestore, you'll need to add save functions

### Signup button doesn't work
**Solution:**
- Check password is at least 6 characters
- Verify email format is correct
- Check browser console for error messages (F12)
- Ensure Email/Password auth is enabled in Firebase

### Can't sign in after signup
**Solution:**
- Wait 5-10 seconds before signing in (auth takes time to propagate)
- Check you're using exact same email and password
- Try incognito/private browser mode
- Clear browser cache (Ctrl+Shift+Del)

## File Structure Explained

\`\`\`
app/
├── page.tsx                      # Entry point - wraps app with FirebaseAuthProvider
├── layout.tsx                    # Root layout with metadata
├── globals.css                   # Global Tailwind styles

lib/
├── firebase.ts                   # Firebase initialization & config
├── constants.ts                  # Mock data for demo
└── types.ts                      # TypeScript interfaces

contexts/
└── FirebaseAuthContext.tsx       # Auth logic (signup, signin, logout, user state)

components/
├── AuthWrapper.tsx              # Handles auth state & routing
├── SignupForm.tsx               # Role-based signup form
├── SigninForm.tsx               # Email/password signin
├── LoginForm.tsx                # Legacy login (optional)
└── CampusMain.tsx               # Main app dashboard (all features)
\`\`\`

## How It Works

1. **User visits app** → Sees `AuthWrapper` component
2. **AuthWrapper checks Firebase auth state**
   - If signed in: Shows `CampusMain` with role-based dashboard
   - If not signed in: Shows `SigninForm` or `SignupForm`
3. **User signs up** → Firebase creates auth account + Firestore user document
4. **User signs in** → Auth context loads user profile and shows correct dashboard
5. **Role-based UI** → `CampusMain` checks user.role and shows relevant features

## Next Steps (Optional Enhancements)

- [ ] Add email verification
- [ ] Add password reset flow
- [ ] Add Google/GitHub OAuth
- [ ] Save form submissions to Firestore
- [ ] Add real-time updates with Firestore listeners
- [ ] Add user profile editing
- [ ] Add profile picture upload
- [ ] Add notifications system

## Support Resources

- [Firebase Docs](https://firebase.google.com/docs)
- [Firebase Auth](https://firebase.google.com/docs/auth)
- [Firestore](https://firebase.google.com/docs/firestore)
- [Next.js Docs](https://nextjs.org/docs)
