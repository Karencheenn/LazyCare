"use client";

import { useState, useEffect } from "react";
import { auth } from "../../library/firebase";
import styles from "./profile.module.css";

export default function ProfilePage({ setUsernameInNavbar }: { setUsernameInNavbar: (username: string) => void }) {
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState("kg"); // default in kg
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);
      setUsername(currentUser.displayName || "");
    }
  }, []);

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/user/email/${user?.email}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          birthday,
          gender,
          weight,
          unit,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      setUsernameInNavbar(username);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>User Profile</h1>

      {/* container including all fields */}
      <div className={styles.formContainer}>
        <div className={styles.form}>
          {/* Gmail (non-editable) */}
          <label>Email</label>
          <input type="email" value={user?.email || ""} disabled className={styles.disabledInput} />

          {/* Username (editable) */}
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={styles.input}
          />

          {/* Birthday */}
          <label>Birthday</label>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className={styles.input}
          />

          {/* Gender */}
          <label>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)} className={styles.input}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="prefer_not_say">Other</option>
          </select>

          {/* Weight */}
          <label>Weight</label>
          <div className={styles.weightInput}>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className={styles.input}
            />
            <select value={unit} onChange={(e) => setUnit(e.target.value)} className={styles.unitSelect}>
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </div>
        </div>

        {/* Success Message */}
        <div className={`${styles.successMessage} ${showSuccess ? styles.showSuccess : ""}`}>
          Save Successful!
        </div>

        {/* Save Button */}
        <button className={styles.saveButton} onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}
