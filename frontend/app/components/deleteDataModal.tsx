"use client";

import { useState, useEffect } from "react";
import styles from "./DeleteDataModal.module.css";

export default function DeleteDataModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2 className={styles.title}>Confirm Deletion</h2>
        <p className={styles.text}>This action cannot be undone. Are you sure you want to delete your data?</p>
        <div className={styles.buttonContainer}>
          <button className={styles.cancelButton} onClick={onClose}>Cancel</button>
          <button className={styles.deleteButton}>Confirm</button>
        </div>
      </div>
    </div>
  );
};
