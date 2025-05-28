import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import api from '../services/api';
import { useNotification } from '../contexts/NotificationContext';
import Card from './Card';
import Modal from './Modal';
import { FaPlus } from 'react-icons/fa'; // Import plus icon

const StyledColumn = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.medium};
  width: 300px;
  max-height: calc(100vh - 180px); /* Keep existing height calculation */
  display: flex;
  flex-direction: column;
  box-shadow: ${({ theme }) => theme.boxShadow.small};
  flex-shrink: 0;
  flex-grow: 1;
`;

const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  padding-bottom: ${({ theme }) => theme.spacing.small};
  border-bottom: 1px solid ${({ theme }) => theme.colors.grayLight};
  cursor: grab;
`;

const ColumnTitle = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.heading3.fontSize};
  color: ${({ theme }) => theme.colors.text};
`;

const AddCardButton = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2em;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary}; /* Use primary color */
    opacity: 0.9; /* Add slight opacity change on hover */
  }
`;

const CardsContainer = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  padding-right: 5px; /* Keep for scrollbar */
`;

const NoCardsMessage = styled.p`
  color: ${({ theme }) => theme.colors.grayDark};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.medium};
`;


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
  // Проверяем, что id является числом, а не строкой
  if (id && !isNaN(parseInt(id))) {
    fetchCards();
  }
}, [id]);

const fetchCards = async () => {
  try {
    // Используем числовой ID для запроса
    const data = await api.getCards(parseInt(id));
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
            const newCard = await api.createCard(id, { title: cardTitle, description: cardDescription, position: cards.length });
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
    <StyledColumn ref={setNodeRef} style={style}>
      <ColumnHeader {...attributes} {...listeners}>
        <ColumnTitle>{name}</ColumnTitle>
        <AddCardButton onClick={handleAddCard}>
          <FaPlus /> {/* Use react-icons component */}
        </AddCardButton>
      </ColumnHeader>
      <CardsContainer>
        {cards.length > 0 ? (
          cards.map(card => (
            <Card key={card.id} card={card} onDelete={handleDeleteCard} />
          ))
        ) : (
          <NoCardsMessage>Нет карточек</NoCardsMessage>
        )}
      </CardsContainer>

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
    </StyledColumn>
  );
}

export default Column;