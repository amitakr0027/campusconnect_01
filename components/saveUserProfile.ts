import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export async function saveUserProfile(uid: string, data: any) {
  await setDoc(doc(db, "users", uid), {
    ...data,
    createdAt: new Date().toISOString(),
    points: 0,
    rank: 0,
    badges: [],
  });
}
