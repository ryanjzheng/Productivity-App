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
  const [activeTab, setActiveTab] = useState('account');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
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
        <div className={styles.tabs}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'account' ? styles.active : ''}`}
            onClick={() => setActiveTab('account')}
          >
            Account
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'preferences' ? styles.active : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            Preferences
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'logout' ? styles.active : ''}`}
            onClick={() => setActiveTab('logout')}
          >
            Logout
          </button>
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'account' && (
            <div>
              <h2>{currentUser?.displayName}</h2>
              <p>{currentUser?.email}</p>
              {/* Add more account-related content here */}
            </div>
          )}
          {activeTab === 'preferences' && (
            <div>
              <h2>Preferences</h2>
              {/* Add preferences options here */}
              <p>Theme: Purp</p>
              <p>Notifications: On</p>
            </div>
          )}
          {activeTab === 'logout' && (
            <div className={styles.logoutContainer}>
              <h2>Are you sure you want to logout?</h2>
              <button onClick={handleLogout} className={styles.logoutButton}>Confirm Logout</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;