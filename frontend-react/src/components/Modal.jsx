import React, { useState, useEffect, useRef } from 'react';
import './Modal.css'; // Создадим этот файл позже

const Modal = ({ title, message, fields, onSave, onConfirm, isConfirm, onClose }) => {
  const [formData, setFormData] = useState({});
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({ ...prevData, [id]: value }));
  };

  const handleSave = () => {
    if (isConfirm) {
      onConfirm();
    } else {
      onSave(formData);
    }
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <h2>{title}</h2>
        {message && <p>{message}</p>}
        {!isConfirm && fields && (
          <form>
            {fields.map(field => (
              <div key={field.id} className="form-group">
                <label htmlFor={field.id}>{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.id}
                    value={formData[field.id] || ''}
                    onChange={handleChange}
                    required={field.required}
                  />
                ) : (
                  <input
                    type={field.type}
                    id={field.id}
                    value={formData[field.id] || ''}
                    onChange={handleChange}
                    required={field.required}
                  />
                )}
              </div>
            ))}
          </form>
        )}
        <div className="modal-actions">
          <button onClick={handleSave} className="button primary">
            {isConfirm ? 'Подтвердить' : 'Сохранить'}
          </button>
          <button onClick={onClose} className="button secondary">
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;