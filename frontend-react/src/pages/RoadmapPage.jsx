import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useNotification } from '../contexts/NotificationContext';
import BoardNavigation from '../components/BoardNavigation';
import ObjectiveItem from '../components/ObjectiveItem';
import Modal from '../components/Modal';
import StyledButton from '../components/StyledButton';
import { FaPlus } from 'react-icons/fa';

const RoadmapPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.medium};
`;

const RoadmapHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const RoadmapTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.heading2.fontSize};
  color: ${({ theme }) => theme.colors.text};
`;

const ObjectivesContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.medium};
`;

function RoadmapPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [objectives, setObjectives] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({});
  const [editingObjective, setEditingObjective] = useState(null);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [currentObjectiveIdForMilestone, setCurrentObjectiveIdForMilestone] = useState(null);

  useEffect(() => {
    if (projectId) {
      fetchObjectives();
    }
  }, [projectId]);

  const fetchObjectives = async () => {
    try {
      const data = await api.getObjectives(projectId);
      setObjectives(data);
    } catch (error) {
      showNotification('Ошибка при загрузке целей.', 'error');
      console.error('Error fetching objectives:', error);
    }
  };

  const handleAddObjective = () => {
    setEditingObjective(null);
    setModalConfig({
      title: 'Создать новую цель',
      fields: [
        { id: 'name', label: 'Название цели', type: 'text', required: true, fullWidth: true },
        { id: 'description', label: 'Описание цели', type: 'textarea', required: false, fullWidth: true },
        { id: 'status', label: 'Статус', type: 'text', required: false, defaultValue: 'not_started' },
        { id: 'owner_agent_id', label: 'Исполнитель (ID)', type: 'text', required: false },
        { id: 'start_date', label: 'Дата начала', type: 'date', required: false },
        { id: 'target_date', label: 'Целевая дата завершения', type: 'date', required: false },
      ],
      onSave: async (formData) => {
        try {
          const newObjective = await api.createObjective(projectId, formData);
          if (newObjective && newObjective.id) {
            showNotification(`Цель "${newObjective.name}" успешно создана!`, 'success');
            fetchObjectives();
          } else {
            showNotification('Ошибка при создании цели.', 'error');
          }
        } catch (error) {
          showNotification('Ошибка при создании цели.', 'error');
          console.error('Error creating objective:', error);
        }
      },
      onClose: () => setIsModalOpen(false)
    });
    setIsModalOpen(true);
  };

  const handleEditObjective = (objective) => {
    setEditingObjective(objective);
    setModalConfig({
      title: `Редактировать цель: ${objective.name}`,
      fields: [
        { id: 'name', label: 'Название цели', type: 'text', required: true, defaultValue: objective.name, fullWidth: true },
        { id: 'description', label: 'Описание цели', type: 'textarea', required: false, defaultValue: objective.description, fullWidth: true },
        { id: 'status', label: 'Статус', type: 'text', required: false, defaultValue: objective.status },
        { id: 'owner_agent_id', label: 'Исполнитель (ID)', type: 'text', required: false, defaultValue: objective.owner_agent_id },
        { id: 'start_date', label: 'Дата начала', type: 'date', required: false, defaultValue: objective.start_date ? objective.start_date.split(' ')[0] : '' },
        { id: 'target_date', label: 'Целевая дата завершения', type: 'date', required: false, defaultValue: objective.target_date ? objective.target_date.split(' ')[0] : '' },
      ],
      onSave: async (formData) => {
        try {
          const updatedObjective = await api.updateObjective(objective.id, formData);
          if (updatedObjective) {
            showNotification(`Цель "${updatedObjective.name}" успешно обновлена!`, 'success');
            fetchObjectives();
          } else {
            showNotification('Ошибка при обновлении цели.', 'error');
          }
        } catch (error) {
          showNotification('Ошибка при обновлении цели.', 'error');
          console.error('Error updating objective:', error);
        }
      },
      onClose: () => {
        setIsModalOpen(false);
        setEditingObjective(null);
      }
    });
    setIsModalOpen(true);
  };

  const handleDeleteObjective = async (objectiveId) => {
    setModalConfig({
      title: 'Удалить цель',
      message: 'Вы уверены, что хотите удалить эту цель? Все связанные этапы и карточки будут также удалены.',
      isConfirm: true,
      onConfirm: async () => {
        try {
          const success = await api.deleteObjective(objectiveId);
          if (success) {
            showNotification('Цель успешно удалена!', 'success');
            fetchObjectives();
          } else {
            showNotification('Ошибка при удалении цели.', 'error');
          }
        } catch (error) {
          showNotification('Ошибка при удалении цели.', 'error');
          console.error('Error deleting objective:', error);
        }
      },
      onClose: () => setIsModalOpen(false)
    });
    setIsModalOpen(true);
  };

  const handleAddMilestone = (objectiveId) => {
    setEditingMilestone(null);
    setCurrentObjectiveIdForMilestone(objectiveId);
    setModalConfig({
      title: 'Создать новый этап',
      fields: [
        { id: 'name', label: 'Название этапа', type: 'text', required: true, fullWidth: true },
        { id: 'description', label: 'Описание этапа', type: 'textarea', required: false, fullWidth: true },
        { id: 'status', label: 'Статус', type: 'text', required: false, defaultValue: 'not_started' },
        { id: 'due_date', label: 'Целевая дата завершения', type: 'date', required: false },
      ],
      onSave: async (formData) => {
        try {
          const newMilestone = await api.createMilestone(objectiveId, formData);
          if (newMilestone && newMilestone.id) {
            showNotification(`Этап "${newMilestone.name}" успешно создан!`, 'success');
            fetchObjectives(); // Обновляем все цели, чтобы увидеть новый этап
          } else {
            showNotification('Ошибка при создании этапа.', 'error');
          }
        } catch (error) {
          showNotification('Ошибка при создании этапа.', 'error');
          console.error('Error creating milestone:', error);
        }
      },
      onClose: () => setIsModalOpen(false)
    });
    setIsModalOpen(true);
  };

  const handleEditMilestone = (milestone) => {
    setEditingMilestone(milestone);
    setModalConfig({
      title: `Редактировать этап: ${milestone.name}`,
      fields: [
        { id: 'name', label: 'Название этапа', type: 'text', required: true, defaultValue: milestone.name, fullWidth: true },
        { id: 'description', label: 'Описание этапа', type: 'textarea', required: false, defaultValue: milestone.description, fullWidth: true },
        { id: 'status', label: 'Статус', type: 'text', required: false, defaultValue: milestone.status },
        { id: 'due_date', label: 'Целевая дата завершения', type: 'date', required: false, defaultValue: milestone.due_date ? milestone.due_date.split(' ')[0] : '' },
      ],
      onSave: async (formData) => {
        try {
          const updatedMilestone = await api.updateMilestone(milestone.id, formData);
          if (updatedMilestone) {
            showNotification(`Этап "${updatedMilestone.name}" успешно обновлен!`, 'success');
            fetchObjectives();
          } else {
            showNotification('Ошибка при обновлении этапа.', 'error');
          }
        } catch (error) {
          showNotification('Ошибка при обновлении этапа.', 'error');
          console.error('Error updating milestone:', error);
        }
      },
      onClose: () => {
        setIsModalOpen(false);
        setEditingMilestone(null);
      }
    });
    setIsModalOpen(true);
  };

  const handleDeleteMilestone = async (milestoneId) => {
    setModalConfig({
      title: 'Удалить этап',
      message: 'Вы уверены, что хотите удалить этот этап? Все связанные карточки будут также удалены.',
      isConfirm: true,
      onConfirm: async () => {
        try {
          const success = await api.deleteMilestone(milestoneId);
          if (success) {
            showNotification('Этап успешно удален!', 'success');
            fetchObjectives();
          } else {
            showNotification('Ошибка при удалении этапа.', 'error');
          }
        } catch (error) {
          showNotification('Ошибка при удалении этапа.', 'error');
          console.error('Error deleting milestone:', error);
        }
      },
      onClose: () => setIsModalOpen(false)
    });
    setIsModalOpen(true);
  };

  const handleFilterCardsByMilestone = (milestoneId) => {
    // Перенаправляем на страницу доски с параметром фильтрации
    navigate(`/project/${projectId}/board/${milestoneId}?filterByMilestone=true`);
  };

  return (
    <RoadmapPageContainer>
      <BoardNavigation />
      <RoadmapHeader>
        <RoadmapTitle>Дорожная карта проекта</RoadmapTitle>
        <StyledButton onClick={handleAddObjective} small>
          <FaPlus /> Новая цель
        </StyledButton>
      </RoadmapHeader>
      <ObjectivesContainer>
        {objectives.length > 0 ? (
          objectives.map(objective => (
            <ObjectiveItem
              key={objective.id}
              objective={objective}
              onEdit={handleEditObjective}
              onDelete={handleDeleteObjective}
              onAddMilestone={handleAddMilestone}
              onEditMilestone={handleEditMilestone}
              onDeleteMilestone={handleDeleteMilestone}
              onFilterCards={handleFilterCardsByMilestone}
            />
          ))
        ) : (
          <p>Нет целей для этого проекта.</p>
        )}
      </ObjectivesContainer>

      {isModalOpen && (
        <Modal
          title={modalConfig.title}
          message={modalConfig.message}
          fields={modalConfig.fields}
          onSave={modalConfig.onSave}
          onConfirm={modalConfig.onConfirm}
          isConfirm={modalConfig.isConfirm}
          onClose={modalConfig.onClose}
          initialData={editingObjective || editingMilestone || {}}
        />
      )}
    </RoadmapPageContainer>
  );
}

export default RoadmapPage;