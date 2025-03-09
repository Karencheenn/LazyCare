"use client";

import { useState, useEffect } from "react";
import styles from "./DeleteDataModal.module.css";

export default function DeleteDataModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  const handleConfirmDelete = async () => {
    // Get the user's email from localStorage
    const userEmail = localStorage.getItem('userEmail');

    if (!userEmail) {
      setError("User email not found. Please make sure you're logged in.");
      return;
    }

    setIsDeleting(true);
    setError("");
    setSuccess(false);

    try {
      console.log("Sending DELETE request to:", `http://localhost:5000/user/email/${userEmail}`);

      const response = await fetch(`http://localhost:5000/user/email/${userEmail}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete user data');
      }

      console.log("User data cleared successfully:", data);

      // Show success message briefly before closing
      setSuccess(true);

      // Close modal after a short delay but don't reload the page
      setTimeout(() => {
        onClose();

        // Instead of reloading the whole page, manually update the form fields
        // while preserving the email
        const formFields = document.querySelectorAll('input, select');
        formFields.forEach(field => {
          // Skip the email field
          if (field.getAttribute('type') !== 'email') {
            if (field.tagName === 'SELECT') {
              (field as HTMLSelectElement).value = '';
            } else if (field.getAttribute('type') === 'date') {
              (field as HTMLInputElement).value = '';
            } else if (field.getAttribute('type') === 'number') {
              (field as HTMLInputElement).value = '';
            }
          }
        });

        // Refresh the profile data from server
        window.dispatchEvent(new CustomEvent('refreshUserData'));
      }, 1500);
    } catch (error: any) {
      console.error("Error deleting user data:", error);
      setError(error.message || "Failed to delete user data. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal}  onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>Confirm Deletion</h2>
        <p className={styles.text}>This action cannot be undone. Are you sure you want to delete your data?</p>

        {error && <p className={styles.errorText}>{error}</p>}
        {success && <p className={styles.successText}>Data successfully deleted!</p>}

        <div className={styles.buttonContainer}>
          <button
            className={styles.cancelButton}
            onClick={onClose}
            disabled={isDeleting || success}
          >
            Cancel
          </button>
          <button
            className={`${styles.deleteButton} ${isDeleting ? styles.loading : ''}`}
            onClick={handleConfirmDelete}
            disabled={isDeleting || success}
          >
            {isDeleting ? "Processing..." : success ? "Done" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}