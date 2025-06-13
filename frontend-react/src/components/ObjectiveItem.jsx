import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ProgressBar from './ProgressBar';
import MilestoneItem from './MilestoneItem';
import api from '../services/api';
import { useNotification } from '../contexts/NotificationContext';
import { FaEdit, FaTrashAlt, FaPlus, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const ObjectiveContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border: 1px solid ${({ theme }) => theme.colors.grayMedium};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.medium};
  margin-bottom: ${({ theme }) => theme.spacing.large};
  box-shadow: ${({ theme }) => theme.boxShadow.medium};
`;

const ObjectiveHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.small};
  cursor: pointer; /* Добавляем курсор для интерактивности */
`;

const ObjectiveTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: ${({ theme }) => theme.typography.heading3.fontSize};
`;

const ObjectiveDetails = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.small};
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  color: ${({ theme }) => theme.colors.text};
`;

const ProgressBarWrapper = styled.div`
  margin-top: ${({ theme }) => theme.spacing.small};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const MilestonesContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.medium};
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
  font-size: 1em;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

function ObjectiveItem({ objective, onEdit, onDelete, onAddMilestone, onEditMilestone, onDeleteMilestone, onFilterCards }) {
  const { showNotification } = useNotification();
  const [isExpanded, setIsExpanded] = useState(true); // По умолчанию развернуто
  const [milestones, setMilestones] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (objective.id) {
      fetchMilestonesForObjective();
    }
  }, [objective.id]);

  useEffect(() => {
    calculateObjectiveProgress();
  }, [milestones]);

  const fetchMilestonesForObjective = async () => {
    try {
      const fetchedMilestones = await api.getMilestones(objective.id);
      setMilestones(fetchedMilestones);
    } catch (error) {
      showNotification('Ошибка при загрузке этапов для цели.', 'error');
      console.error('Error fetching milestones for objective:', error);
    }
  };

  const calculateObjectiveProgress = () => {
    if (!milestones || milestones.length === 0) {
      setProgress(0);
      return;
    }
    const totalProgress = milestones.reduce((sum, m) => {
      // Здесь нужно будет получить прогресс каждого Milestone из MilestoneItem
      // Пока что заглушка, предполагаем, что MilestoneItem будет возвращать свой прогресс
      // Для простоты, пока что, будем считать, что прогресс Milestone - это 0 или 100
      return sum + (m.status === 'completed' ? 100 : 0);
    }, 0);
    const calculatedProgress = totalProgress / milestones.length;
    setProgress(calculatedProgress);
  };

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <ObjectiveContainer>
      <ObjectiveHeader onClick={handleToggleExpand}>
        <ObjectiveTitle>{objective.name} - {objective.status}</ObjectiveTitle>
        <Actions>
          <ActionButton onClick={(e) => { e.stopPropagation(); onAddMilestone(objective.id); }}>
            <FaPlus /> Добавить этап
          </ActionButton>
          <ActionButton onClick={(e) => { e.stopPropagation(); onEdit(objective); }}>
            <FaEdit />
          </ActionButton>
          <ActionButton onClick={(e) => { e.stopPropagation(); onDelete(objective.id); }}>
            <FaTrashAlt />
          </ActionButton>
          {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
        </Actions>
      </ObjectiveHeader>
      {isExpanded && (
        <>
          <ObjectiveDetails>
            <p>{objective.description}</p>
            <p>Начало: {objective.start_date} | Цель: {objective.target_date}</p>
            <ProgressBarWrapper>
              <ProgressBar progress={progress} />
            </ProgressBarWrapper>
          </ObjectiveDetails>
          <MilestonesContainer>
            {milestones.length > 0 ? (
              milestones.map(milestone => (
                <MilestoneItem
                  key={milestone.id}
                  milestone={milestone}
                  onEdit={onEditMilestone}
                  onDelete={onDeleteMilestone}
                  onFilterCards={onFilterCards}
                />
              ))
            ) : (
              <p>Нет этапов для этой цели.</p>
            )}
          </MilestonesContainer>
        </>
      )}
    </ObjectiveContainer>
  );
}

export default ObjectiveItem;