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
  flex: 1; /* Allow columns to grow and shrink */
  min-width: 250px; /* Ensure a minimum readable width for columns */
  max-height: calc(100vh - 180px); /* Keep existing height calculation */
  display: flex;
  flex-direction: column;
  box-shadow: ${({ theme }) => theme.boxShadow.small};
`;

const ColumnHeader = styled.div`
  display: flex;
  justify-content: center;
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


function Column({ column, onCardAdded, onEditCard }) { // Добавляем onCardAdded и onEditCard в пропсы
  const { id, name, cards } = column; // Получаем cards из пропсов
  const { showNotification } = useNotification();
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
            if (onCardAdded) { // Используем onCardAdded для обновления после удаления
              onCardAdded();
            }
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
      </ColumnHeader>
      <CardsContainer>
        {cards.length > 0 ? (
          cards.map(card => (
            <Card
              key={card.id}
              card={card}
              onDelete={handleDeleteCard}
              onEdit={onEditCard} // Передаем onEditCard в Card
            />
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