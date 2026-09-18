"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInAnonymously,
  type User,
} from "firebase/auth";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase/client";
import { useDeviceUid } from "@/lib/kpss/device";

type AuthState = {
  user: User | null;
  uid: string;
  loading: boolean;
  mode: "firebase" | "local";
};

const AuthContext = createContext<AuthState>({
  user: null,
  uid: "",
  loading: true,
  mode: "local",
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const deviceUid = useDeviceUid();
  const [firebase, setFirebase] = useState<{
    user: User | null;
    settled: boolean;
  }>(() => ({ user: null, settled: !isFirebaseConfigured() }));

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) return;

    return onAuthStateChanged(auth, (user) => {
      if (user) {
        setFirebase({ user, settled: true });
        return;
      }
      signInAnonymously(auth).catch(() =>
        setFirebase({ user: null, settled: true }),
      );
    });
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user: firebase.user,
      uid: firebase.user?.uid ?? deviceUid,
      loading: !firebase.settled || deviceUid === "",
      mode: firebase.user ? "firebase" : "local",
    }),
    [firebase, deviceUid],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
