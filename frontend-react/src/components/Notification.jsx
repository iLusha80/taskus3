import React, { useState, useEffect } from 'react';
import './Notification.css'; // Создадим этот файл позже

const Notification = ({ message, type, duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`notification ${type}`}>
      {message}
      <button className="notification-close" onClick={() => setIsVisible(false)}>
        &times;
      </button>
    </div>
  );
};

export default Notification;