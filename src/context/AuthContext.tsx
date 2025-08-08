// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import type { User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { paths } from "@/utils/paths";
import { passthroughConverter } from "@/utils/firestore";

// NOTE: import your app types from the same module that defines them
import type { User as AppUser, Organization, Project } from "@/types/types";

interface Profile extends AppUser {
  // don't redeclare `role` here — it already exists on AppUser
  organization?: Organization;
  projects?: Project[];
}

interface AuthContextValue {
  user: FirebaseUser | null;
  profile: Profile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  loading: true,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const ref = doc(db, paths.user(firebaseUser.uid)).withConverter(
            passthroughConverter<Profile>()
          );
          const snap = await getDoc(ref);
          setProfile(snap.exists() ? snap.data() : null);
        } catch (e) {
          console.error("Error loading profile:", e);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
