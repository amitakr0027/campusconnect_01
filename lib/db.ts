import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export const saveUserProfile = async (uid: string, data: any) => {
  return await setDoc(doc(db, "users", uid), data, { merge: true });
};
