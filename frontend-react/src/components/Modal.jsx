import React, { useState, useEffect, useRef } from 'react';
import './Modal.css'; // Создадим этот файл позже

const Modal = ({ title, message, fields, onSave, onConfirm, isConfirm, onClose, initialData = {} }) => {
  const [formData, setFormData] = useState(initialData); // Инициализируем formData с initialData
  const modalRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      // Проверяем, что клик был именно на overlay (фон модального окна)
      if (event.target.classList.contains('modal-overlay')) {
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
              <div key={field.id} className={`form-group ${field.fullWidth ? 'full-width' : ''}`}>
                <label htmlFor={field.id}>{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    id={field.id}
                    value={formData[field.id] || ''}
                    onChange={handleChange}
                    required={field.required}
                  />
                ) : field.type === 'select' ? (
                  <select
                    id={field.id}
                    value={formData[field.id] !== undefined ? formData[field.id] : ''}
                    onChange={handleChange}
                    required={field.required}
                  >
                    {field.options && field.options.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    id={field.id}
                    value={formData[field.id] !== undefined ? formData[field.id] : ''}
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