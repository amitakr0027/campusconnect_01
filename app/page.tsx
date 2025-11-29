"use client";

import { FirebaseAuthProvider } from "@/contexts/FirebaseAuthContext";
import AuthWrapper from "@/components/AuthWrapper";
import FloatingChatbot from "@/components/FloatingChatbot";

export default function App() {
  return (
    <FirebaseAuthProvider>

      {/* Floating chatbot in bottom-right */}
      <FloatingChatbot />

      {/* Your protected dashboard */}
      <AuthWrapper>
        {/* your dashboard / pages */}
      </AuthWrapper>

    </FirebaseAuthProvider>
  );
}
