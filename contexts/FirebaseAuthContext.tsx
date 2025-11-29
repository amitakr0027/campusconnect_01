"use client";

import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  type UserCredential,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: "student" | "faculty" | "admin";
  department: string;
  points: number;
  rank: number;
  badges: string[];
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signup: (
    email: string,
    password: string,
    name: string,
    role: string,
    department: string
  ) => Promise<UserCredential>;
  signin: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const FirebaseAuthContext = createContext<AuthContextType | undefined>(undefined);

export const FirebaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        setUser(currentUser);
        if (currentUser) {
          const profileDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (profileDoc.exists()) {
            setProfile(profileDoc.data() as UserProfile);
          }
        } else {
          setProfile(null);
        }
      } catch (err) {
        console.error("Error in auth state change:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // SIGNUP
  const signup = async (
    email: string,
    password: string,
    name: string,
    role: string,
    department: string
  ): Promise<UserCredential> => {
    clearError();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential; // SignupForm will save Firestore profile
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "Signup failed");
      throw err;
    }
  };

  // SIGNIN
  const signin = async (email: string, password: string): Promise<UserCredential> => {
    clearError();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Fetch user profile
      const profileDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      if (profileDoc.exists()) {
        setProfile(profileDoc.data() as UserProfile);
      }

      return userCredential;
    } catch (err: any) {
      console.error("Signin error:", err);
      setError(err.message || "Signin failed");
      throw err;
    }
  };

  // LOGOUT
  const logout = async () => {
    clearError();
    try {
      await signOut(auth);
      setProfile(null);
    } catch (err: any) {
      setError(err.message || "Logout failed");
      throw err;
    }
  };

  const clearError = () => setError(null);

  return (
    <FirebaseAuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signup,
        signin,
        logout,
        error,
        clearError,
      }}
    >
      {children}
    </FirebaseAuthContext.Provider>
  );
};

export const useFirebaseAuth = () => {
  const context = useContext(FirebaseAuthContext);
  if (!context) {
    throw new Error("useFirebaseAuth must be used within FirebaseAuthProvider");
  }
  return context;
};
