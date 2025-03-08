"use client";

import { useRouter } from "next/navigation";
import { auth } from "../../library/firebase";
import { useEffect, useState } from "react";
import styles from "./Navbar.module.css";
import { User, MessageSquare, BrainCircuit, Trash2, LogOut } from "lucide-react";

export default function Navbar({ setDeleteModalOpen }: { setDeleteModalOpen: (open: boolean) => void }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setUsername(currentUser?.displayName || "");
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);

    const handleStorageChange = () => {
      const updatedUsername = localStorage.getItem("username");
      if (updatedUsername) setUsername(updatedUsername);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/login");
  };

  return (
    <nav className={styles.navbar}>
      {/* user info */}
      {user && (
        <div className={styles.userInfo}>
          <img src={user.photoURL || "/images/default-avatar.png"} alt="User Avatar" className={styles.userAvatar} />
          <div className={styles.userName}>{username}</div>
        </div>
      )}
      <div className={styles.divider}></div> {/* break line */}

      {/* navbar buttons */}
            <ul className={styles.navList}>
        <li>
          <button onClick={() => router.push("/profile")} className={styles.navButton}>
            <User className={styles.navIcon} /> Profile
          </button>
        </li>
        <li>
          <button onClick={() => router.push("/chat")} className={styles.navButton}>
            <MessageSquare className={styles.navIcon} /> Chat
          </button>
        </li>
        <li>
          <button onClick={() => router.push("/ai-analysis")} className={styles.navButton}>
            <BrainCircuit className={styles.navIcon} /> AI Analysis
          </button>
        </li>
        <li>
          <button onClick={() => setDeleteModalOpen(true)} className={styles.navButton}>
            <Trash2 className={styles.navIcon} /> Delete Data
          </button>
        </li>
        <li>
          <button onClick={handleLogout} className={`${styles.navButton} ${styles.logout}`}>
            <LogOut className={styles.navIcon} /> Logout
          </button>
        </li>
      </ul>

    </nav>
  );
};
