"use client";

import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../library/firebase";
import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        router.push("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return <>{user ? children : null}</>;
}
