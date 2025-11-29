"use client";

import { useState } from "react";
import { useFirebaseAuth } from "@/contexts/FirebaseAuthContext";
import SigninForm from "./SigninForm";
import SignupForm from "./SignupForm";
import CampusMain from "./CampusMain";
import { BookOpen } from "lucide-react";

export default function AuthWrapper() {
  const { user, profile, loading, error: authError } = useFirebaseAuth();
  const [isSignup, setIsSignup] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-indigo-600 p-2 rounded-lg animate-pulse">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // 🔥 Firebase is ready by default if loading is false — no check needed

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex bg-gray-50 dark:bg-slate-900 transition-colors font-sans">
        
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 relative overflow-hidden flex-col justify-between p-12 text-white">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-indigo-500 opacity-50 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-500 opacity-30 blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">CampusConnect</span>
            </div>
            <h1 className="text-5xl font-extrabold leading-tight mb-6">
              Your Campus Life, <br />
              <span className="text-indigo-200">Reimagined.</span>
            </h1>
            <p className="text-lg text-indigo-100 max-w-md leading-relaxed">
              One platform to manage classes, events, resources, and community. Connect with peers, book labs, and stay
              updated in real-time.
            </p>
          </div>
          <div className="relative z-10 text-sm text-indigo-200 font-medium">
            © 2025 Campus Management System
          </div>
        </div>

        {/* Right Side - Form */}
        {isSignup ? (
          <SignupForm
            onSignupSuccess={() => setIsSignup(false)}
            onToggleForm={() => setIsSignup(false)}
          />
        ) : (
          <SigninForm
            onSigninSuccess={() => {}}
            onToggleForm={() => setIsSignup(true)}
          />
        )}
      </div>
    );
  }

  return <CampusMain currentUser={profile} />;
}
