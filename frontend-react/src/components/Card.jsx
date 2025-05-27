import React from 'react';
import './Card.css'; // Создадим этот файл позже

function Card({ card, onDelete }) {
  const { id, title, description } = card;

  return (
    <div className="card">
      <h4>{title}</h4>
      {description && <p>{description}</p>}
      <div className="card-actions">
        {/* <button className="edit-button">
          <i className="fas fa-edit"></i>
        </button> */}
        <button className="delete-button" onClick={() => onDelete(id)}>
          <i className="fas fa-trash-alt"></i>
        </button>
      </div>
    </div>
  );
}

export default Card;