import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as fbSignOut,
  updateProfile,
} from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";
import { db } from "@/firebase/firebaseConfig";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { paths } from "@/utils/paths";
import { passthroughConverter } from "@/utils/firestore";

type Role = "admin" | "manager" | "staff" | "client" | "viewer";

export type Profile = {
  id: string;
  role: Role;
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  createdAt?: any;
  updatedAt?: any;
};

type AuthContextShape = {
  user: FirebaseUser | null;
  profile: Profile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextShape | undefined>(undefined);

async function ensureUserProfile(u: FirebaseUser): Promise<Profile> {
  const ref = doc(db, paths.user(u.uid)).withConverter(
    passthroughConverter<Profile>()
  );
  const snap = await getDoc(ref);
  if (snap.exists()) {
    const p = snap.data();
    return { ...p, id: u.uid };
  }
  const newProfile: Profile = {
    id: u.uid,
    role: "client",
    email: u.email,
    displayName: u.displayName,
    photoURL: u.photoURL,
    createdAt: serverTimestamp() as any,
    updatedAt: serverTimestamp() as any,
  };
  await setDoc(ref, newProfile as any, { merge: true });
  return newProfile;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, async (u) => {
      try {
        setUser(u);
        if (u) {
          const p = await ensureUserProfile(u);
          setProfile(p);
        } else {
          setProfile(null);
        }
      } catch (e) {
        console.error("AuthContext error:", e);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const signInWithGoogle = async () => {
    const auth = getAuth();
    await signInWithPopup(auth, new GoogleAuthProvider());
  };

  const signInWithEmail = async (email: string, password: string) => {
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    displayName?: string
  ) => {
    const auth = getAuth();
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    await ensureUserProfile(cred.user);
  };

  const resetPassword = async (email: string) => {
    const auth = getAuth();
    await sendPasswordResetEmail(auth, email);
  };

  const signOut = async () => {
    const auth = getAuth();
    await fbSignOut(auth);
  };

  const value = useMemo<AuthContextShape>(
    () => ({
      user,
      profile,
      loading,
      signInWithGoogle,
      signInWithEmail,
      signUpWithEmail,
      resetPassword,
      signOut,
    }),
    [user, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
