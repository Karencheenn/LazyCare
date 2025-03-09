"use client";

import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import Particles from "react-tsparticles";
import { Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";
import { auth } from "../../library/firebase";
import styles from "./login.module.css";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (auth.currentUser) {
      router.push("/");
    }
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // get user info
      const user = result.user;
      const username = user.displayName; // username
      const email = user.email; // user email

      // api to create or update user
      const response = await fetch('http://localhost:5000/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email }), // only send username and email
      });

      if (!response.ok) {
        throw new Error('Failed to create or update user');
      }

      router.push("/profile");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // Initialize Particle Animation
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className={styles.pageWrapper}>
      {/* Particle Background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: true },
          background: { color: "transparent" },
          particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: ["#98585c", "#737b5e", "#e8e5df", "#797979"] },
            shape: { type: "circle" },
            opacity: { value: 0.6, random: true },
            size: { value: 4, random: true },
            move: {
              enable: true,
              speed: 2,
              outModes: "out",
              attract: {
                enable: true,
                rotateX: 600,
                rotateY: 600,
              },
            },
            links: {
              enable: true,
              distance: 150,
              color: "#ffffff",
              opacity: 0.4,
              width: 1,
            },
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: "attract" },
            },
            modes: {
              attract: {
                distance: 200,
                duration: 0.2,
                speed: 7,
              },
            },
          },
          retina_detect: true,
        }}
        className={styles.particlesCanvas}
      />

      {/* Login Box */}
      <div className={styles.loginContainer}>
        <h1 className={styles.loginTitle}>Lazy Care</h1>
        <p className={styles.loginSubtitle}>Step by Step, Health for Life</p>
        <button onClick={handleLogin} className={styles.loginButton}>
          Login with Google
        </button>
      </div>
    </div>
  );
}