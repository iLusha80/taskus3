import React, { useState, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import api from '../services/api';
import { useNotification } from '../contexts/NotificationContext';
import Card from './Card'; // Будет создан
import Modal from './Modal';
import './Column.css'; // Создадим этот файл позже

function Column({ column }) {
  const { id, name } = column;
  const { showNotification } = useNotification();
  const [cards, setCards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({});

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    fetchCards();
  }, [id]);

  const fetchCards = async () => {
    try {
      const data = await api.getCards(id);
      setCards(data);
    } catch (error) {
      showNotification('Ошибка при загрузке карточек.', 'error');
      console.error('Error fetching cards:', error);
    }
  };

  const handleAddCard = () => {
    setModalConfig({
      title: 'Создать новую карточку',
      fields: [
        { id: 'cardTitle', label: 'Название карточки', type: 'text', required: true },
        { id: 'cardDescription', label: 'Описание карточки (необязательно)', type: 'textarea', required: false }
      ],
      onSave: async (formData) => {
        const { cardTitle, cardDescription } = formData;
        if (cardTitle) {
          try {
            const newCard = await api.createCard(id, { title: cardTitle, description: cardDescription });
            if (newCard && newCard.id) {
              showNotification(`Карточка "${newCard.title}" успешно создана!`, 'success');
              fetchCards();
            } else {
              showNotification('Ошибка при создании карточки.', 'error');
            }
          } catch (error) {
            showNotification('Ошибка при создании карточки.', 'error');
            console.error('Error creating card:', error);
          }
        }
      },
      onClose: () => setIsModalOpen(false)
    });
    setIsModalOpen(true);
  };

  const handleDeleteCard = async (cardId) => {
    setModalConfig({
      title: 'Подтверждение удаления',
      message: 'Вы уверены, что хотите удалить эту карточку? Это действие необратимо.',
      isConfirm: true,
      onConfirm: async () => {
        try {
          const success = await api.deleteCard(cardId);
          if (success) {
            showNotification('Карточка успешно удалена.', 'success');
            fetchCards();
          } else {
            showNotification('Ошибка при удалении карточки.', 'error');
          }
        } catch (error) {
          showNotification('Ошибка при удалении карточки.', 'error');
          console.error('Error deleting card:', error);
        }
      },
      onClose: () => setIsModalOpen(false)
    });
    setIsModalOpen(true);
  };

  return (
    <div ref={setNodeRef} style={style} className="column">
      <div className="column-header" {...attributes} {...listeners}>
        <h3>{name}</h3>
        <button className="add-card-button" onClick={handleAddCard}>
          <i className="fas fa-plus"></i>
        </button>
      </div>
      <div className="cards-container">
        {cards.length > 0 ? (
          cards.map(card => (
            <Card key={card.id} card={card} onDelete={handleDeleteCard} />
          ))
        ) : (
          <p className="no-cards-message">Нет карточек</p>
        )}
      </div>

      {isModalOpen && (
        <Modal
          title={modalConfig.title}
          message={modalConfig.message}
          fields={modalConfig.fields}
          onSave={modalConfig.onSave}
          onConfirm={modalConfig.onConfirm}
          isConfirm={modalConfig.isConfirm}
          onClose={modalConfig.onClose}
        />
      )}
    </div>
  );
}

export default Column;