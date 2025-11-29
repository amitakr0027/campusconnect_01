"use client"

import { FirebaseAuthProvider } from "@/contexts/FirebaseAuthContext"
import AuthWrapper from "@/components/AuthWrapper"

export default function App() {
  return (
    <FirebaseAuthProvider>
      <AuthWrapper />
    </FirebaseAuthProvider>
  )
}
