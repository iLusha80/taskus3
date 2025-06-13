import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import api from '../services/api';
import { useNotification } from '../contexts/NotificationContext';
import BoardNavigation from '../components/BoardNavigation';
import Column from '../components/Column';
import Modal from '../components/Modal';
import StyledButton from '../components/StyledButton'; // Import StyledButton
import { FaPlus } from 'react-icons/fa'; // Import plus icon
import AutoRefreshToggle from '../components/AutoRefreshToggle'; // Import AutoRefreshToggle

const BoardPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.medium};
`;

const BoardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const BoardTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.heading2.fontSize};
  color: ${({ theme }) => theme.colors.text};
`;

const ColumnsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.medium};
  justify-content: flex-start;
  padding: 0 ${({ theme }) => theme.spacing.medium};
  padding-bottom: ${({ theme }) => theme.spacing.small}; /* For scrollbar */
  overflow-x: auto;
  margin-top: ${({ theme }) => theme.spacing.medium};
`;

// Removed local AddButton styled component


function BoardPage() {
  const { projectId, boardId } = useParams();
  const { showNotification } = useNotification();
  const [columns, setColumns] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({});
  const [editingCard, setEditingCard] = useState(null); // Новое состояние для редактируемой карточки
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false); // Состояние для автообновления
  const [milestones, setMilestones] = useState([]); // Состояние для хранения этапов

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (boardId) {
      fetchColumns();
      fetchMilestonesForProject(); // Загружаем этапы при загрузке страницы
    }
  }, [boardId]);

  useEffect(() => {
    let intervalId;
    if (autoRefreshEnabled) {
      intervalId = setInterval(() => {
        fetchColumns();
      }, 5000); // Обновление каждые 5 секунд
    }
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [autoRefreshEnabled, boardId]); // Зависимости для эффекта автообновления

const fetchColumns = async () => {
  try {
    let data = await api.getColumns(boardId);

    // Если колонок нет, создаем колонки по умолчанию
    if (!data || data.length === 0) {
      showNotification('Колонки не найдены. Создаем колонки по умолчанию.', 'info');
      const defaultColumnNames = ['К выполнению', 'В работе', 'На проверке', 'Выполнено'];
      const createdColumns = [];
      for (let i = 0; i < defaultColumnNames.length; i++) {
        const newColumn = await api.createColumn(boardId, {
          name: defaultColumnNames[i],
          position: i,
          metadata: '{}'
        });
        createdColumns.push(newColumn);
      }
      data = createdColumns; // Используем созданные колонки
    }
    
    // Убедимся, что каждая колонка имеет массив cards
    const columnsWithCards = data.map(col => ({
      ...col,
      cards: Array.isArray(col.cards) ? col.cards : []
    }));

    setColumns(columnsWithCards);
  } catch (error) {
    showNotification('Ошибка при загрузке колонок.', 'error');
    console.error('Error fetching columns:', error);
    setColumns([]); // Устанавливаем пустой массив в случае ошибки
  }
};

  const handleAddCardAtBoardLevel = () => {
  setModalConfig({
    title: 'Создать новую задачу',
    fields: [
      { id: 'cardTitle', label: 'Название задачи', type: 'text', required: true, fullWidth: true },
      { id: 'cardDescription', label: 'Описание задачи (необязательно)', type: 'textarea', required: false, fullWidth: true },
      {
        id: 'milestone_id',
        label: 'Этап (Milestone)',
        type: 'select',
        options: [{ value: '', label: 'Без этапа' }, ...milestones.map(m => ({ value: m.id, label: m.name }))],
        required: false,
        fullWidth: true
      }
    ],
    onSave: async (formData) => {
      const { cardTitle, cardDescription, milestone_id } = formData;
      if (cardTitle) {
        try {
          let firstColumn = columns[0];
          if (!firstColumn) {
            const backendColumns = await api.getColumns(boardId);
            firstColumn = backendColumns[0];
            if (!firstColumn) {
              firstColumn = await api.createColumn(boardId, {
                name: 'К выполнению',
                position: 0,
                metadata: '{}'
              });
            }
          }

          const newCard = await api.createCard(firstColumn.id, {
            title: cardTitle,
            description: cardDescription,
            position: 0,
            milestone_id: milestone_id || null // Добавляем milestone_id
          });
          
          if (newCard && newCard.id) {
            showNotification(`Задача "${newCard.title}" успешно создана!`, 'success');
            fetchColumns();
          } else {
            showNotification('Ошибка при создании задачи.', 'error');
          }
        } catch (error) {
          showNotification('Ошибка при создании задачи.', 'error');
          console.error('Error creating card:', error);
        }
      }
    },
    onClose: () => setIsModalOpen(false)
  });
  setIsModalOpen(true);
};

 const handleEditCard = (card) => {
   setEditingCard(card); // Устанавливаем редактируемую карточку
   setModalConfig({
     title: `Редактировать задачу: ${card.title}`,
     fields: [
       { id: 'title', label: 'Название задачи', type: 'text', required: true, defaultValue: card.title, fullWidth: true },
       { id: 'description', label: 'Описание задачи', type: 'textarea', required: false, defaultValue: card.description, fullWidth: true },
       { id: 'status', label: 'Статус', type: 'text', required: false, defaultValue: card.status },
       { id: 'priority', label: 'Приоритет', type: 'text', required: false, defaultValue: card.priority },
       { id: 'assigned_agent_id', label: 'Исполнитель (ID)', type: 'text', required: false, defaultValue: card.assigned_agent_id },
       { id: 'task_type', label: 'Тип задачи', type: 'text', required: false, defaultValue: card.task_type },
       { id: 'start_date', label: 'Дата начала', type: 'date', required: false, defaultValue: card.start_date ? card.start_date.split('T')[0] : '' },
       { id: 'due_date', label: 'Дата завершения', type: 'date', required: false, defaultValue: card.due_date ? card.due_date.split('T')[0] : '' },
       {
         id: 'milestone_id',
         label: 'Этап (Milestone)',
         type: 'select',
         options: [{ value: '', label: 'Без этапа' }, ...milestones.map(m => ({ value: m.id, label: m.name }))],
         required: false,
         fullWidth: true,
         defaultValue: card.milestone_id || ''
       }
     ],
     onSave: async (formData) => {
       try {
         const updatedCard = await api.updateCard(card.id, formData);
         if (updatedCard) {
           showNotification(`Задача "${updatedCard.title}" успешно обновлена!`, 'success');
           fetchColumns(); // Обновляем список колонок и карточек
         } else {
           showNotification('Ошибка при обновлении задачи.', 'error');
         }
       } catch (error) {
         showNotification('Ошибка при обновлении задачи.', 'error');
         console.error('Error updating card:', error);
       }
     },
     onClose: () => {
       setIsModalOpen(false);
       setEditingCard(null); // Сбрасываем редактируемую карточку при закрытии
     }
   });
   setIsModalOpen(true);
 };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!active || !over) return;

    if (active.id !== over.id) {
      const activeColumn = columns.find(col => col.id === active.id);
      const overColumn = columns.find(col => col.id === over.id);

      // Logic for reordering columns
      if (activeColumn && overColumn) {
        const oldIndex = columns.findIndex(col => col.id === active.id);
        const newIndex = columns.findIndex(col => col.id === over.id);
        const newColumns = arrayMove(columns, oldIndex, newIndex);
        setColumns(newColumns);
        // TODO: Отправить запрос на бэкенд для обновления порядка колонок
        showNotification('Порядок колонок обновлен (требуется бэкенд-реализация).', 'info');
      } else {
        // Logic for moving cards between columns
        // This will be more complex and involve updating card's columnId
        // For now, we'll just log it.
        showNotification('Перемещение карточек между колонками пока не реализовано.', 'info');
        console.log(`Card ${active.id} moved from column ${activeColumn?.id} to column ${overColumn?.id}`);
      }
    }
  };

  const fetchMilestonesForProject = async () => {
    try {
      const data = await api.getMilestonesByProject(projectId);
      setMilestones(data);
    } catch (error) {
      showNotification('Ошибка при загрузке этапов проекта.', 'error');
      console.error('Error fetching milestones for project:', error);
    }
  };

  return (
    <BoardPageContainer>
      <BoardNavigation />
      <BoardHeader>
        <BoardTitle></BoardTitle>
        <div style={{ display: 'flex', gap: '10px' }}>
          <StyledButton onClick={handleAddCardAtBoardLevel} small> {/* Use StyledButton with small prop */}
            <FaPlus /> Новая задача
          </StyledButton>
          <AutoRefreshToggle
            autoRefreshEnabled={autoRefreshEnabled}
            setAutoRefreshEnabled={setAutoRefreshEnabled}
            refreshInterval={5000} // Фиксированный интервал в мс
            onRefresh={fetchColumns} // Передаем fetchColumns для сброса таймера
          />
        </div>
      </BoardHeader>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <ColumnsContainer>
          <SortableContext items={columns.map(col => col.id)}>
            {columns.map(column => (
              <Column
                key={column.id}
                column={column}
                onCardAdded={fetchColumns}
                onEditCard={handleEditCard} // Передаем функцию редактирования
              />
            ))}
          </SortableContext>
        </ColumnsContainer>
      </DndContext>

      {isModalOpen && (
        <Modal
          title={modalConfig.title}
          message={modalConfig.message}
          fields={modalConfig.fields}
          onSave={modalConfig.onSave}
          onConfirm={modalConfig.onConfirm}
          isConfirm={modalConfig.isConfirm}
          onClose={modalConfig.onClose}
          initialData={editingCard || {}} // Передаем пустой объект, если editingCard null
        />
      )}
    </BoardPageContainer>
  );
}

export default BoardPage;