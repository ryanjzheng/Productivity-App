import React, { useRef, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './ProfileModal.module.css';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, logout } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);
  const [showBackground, setShowBackground] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Start the background transition after a short delay
      const timer = setTimeout(() => setShowBackground(true), 300);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        clearTimeout(timer);
      };
    } else {
      setShowBackground(false);
    }
  }, [isOpen, onClose]);

  const handleLogout = async () => {
    try {
      await logout();
      onClose();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`${styles.modalOverlay} ${showBackground ? styles.imageVisible : ''}`}>
      <div ref={modalRef} className={styles.modalContent}>
        <h2>{currentUser?.displayName}</h2>
        <p>{currentUser?.email}</p>
        <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
      </div>
    </div>
  );
};

export default ProfileModal;