import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ProgressBar from './ProgressBar';
import api from '../services/api';
import { useNotification } from '../contexts/NotificationContext';
import { FaChevronDown, FaChevronUp, FaEdit, FaTrashAlt } from 'react-icons/fa';

const MilestoneContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.grayLight};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.medium};
  margin-bottom: ${({ theme }) => theme.spacing.small};
  box-shadow: ${({ theme }) => theme.boxShadow.small};
  margin-left: ${({ theme }) => theme.spacing.large}; /* Indent for hierarchy */
`;

const MilestoneHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const MilestoneTitle = styled.h4`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.body.fontSize};
`;

const MilestoneDetails = styled.div`
  margin-top: ${({ theme }) => theme.spacing.small};
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  color: ${({ theme }) => theme.colors.grayDark};
`;

const ProgressBarWrapper = styled.div`
  margin-top: ${({ theme }) => theme.spacing.small};
`;

const CardList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: ${({ theme }) => theme.spacing.small};
  border-top: 1px solid ${({ theme }) => theme.colors.grayLight};
  padding-top: ${({ theme }) => theme.spacing.small};
`;

const CardItem = styled.li`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border: 1px solid ${({ theme }) => theme.colors.grayLight};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  padding: ${({ theme }) => theme.spacing.xsmall};
  margin-bottom: ${({ theme }) => theme.spacing.xsmall};
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.typography.xsmall.fontSize};
  color: ${({ theme }) => theme.colors.text};
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xsmall};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.grayDark};
  font-size: 0.9em;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

function MilestoneItem({ milestone, onEdit, onDelete, onFilterCards }) {
  const { showNotification } = useNotification();
  const [isExpanded, setIsExpanded] = useState(false);
  const [cards, setCards] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isExpanded && milestone.id && milestone.objective_id) {
      fetchCardsForMilestone();
    }
  }, [isExpanded, milestone.id, milestone.objective_id]);

  useEffect(() => {
    calculateProgress();
  }, [cards, milestone]);

  const fetchCardsForMilestone = async () => {
    try {
      const fetchedCards = await api.getCardsByMilestone(milestone.objective_id, milestone.id);
      setCards(fetchedCards);
    } catch (error) {
      showNotification('Ошибка при загрузке карточек для этапа.', 'error');
      console.error('Error fetching cards for milestone:', error);
    }
  };

  const calculateProgress = () => {
    if (!cards || cards.length === 0) {
      setProgress(0);
      return;
    }
    const completedCards = cards.filter(card => card.status === 'Выполнено').length; // Предполагаем статус 'Выполнено'
    const calculatedProgress = (completedCards / cards.length) * 100;
    setProgress(calculatedProgress);
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <MilestoneContainer>
      <MilestoneHeader onClick={handleToggleExpand}>
        <MilestoneTitle>{milestone.name} - {milestone.status}</MilestoneTitle>
        <Actions>
          <ActionButton onClick={(e) => { e.stopPropagation(); onEdit(milestone); }}>
            <FaEdit />
          </ActionButton>
          <ActionButton onClick={(e) => { e.stopPropagation(); onDelete(milestone.id); }}>
            <FaTrashAlt />
          </ActionButton>
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </Actions>
      </MilestoneHeader>
      <MilestoneDetails>
        <p>{milestone.description}</p>
        <p>Срок: {milestone.due_date}</p>
        <ProgressBarWrapper>
          <ProgressBar progress={progress} />
        </ProgressBarWrapper>
      </MilestoneDetails>
      {isExpanded && (
        <CardList>
          {cards.length > 0 ? (
            cards.map(card => (
              <CardItem key={card.id}>
                <span>{card.title} - {card.status}</span>
                {/* Здесь можно добавить ссылку на карточку или другие действия */}
              </CardItem>
            ))
          ) : (
            <CardItem>Нет связанных карточек.</CardItem>
          )}
        </CardList>
      )}
    </MilestoneContainer>
  );
}

export default MilestoneItem;