import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import api from '../services/api';
import { useNotification } from '../contexts/NotificationContext';
import BoardNavigation from '../components/BoardNavigation';
import Column from '../components/Column'; // Будет создан
import Modal from '../components/Modal';
import './BoardPage.css'; // Создадим этот файл позже

function BoardPage() {
  const { projectId, boardId } = useParams();
  const { showNotification } = useNotification();
  const [columns, setColumns] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({});

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (boardId) {
      fetchColumns();
    }
  }, [boardId]);

  const fixedColumns = [
    { id: 'todo', name: 'К выполнению', cards: [] },
    { id: 'in-progress', name: 'В работе', cards: [] },
    { id: 'in-review', name: 'На проверке', cards: [] },
    { id: 'done', name: 'Выполнено', cards: [] },
  ];

  const fetchColumns = async () => {
    try {
      const data = await api.getColumns(boardId);
      // Распределяем существующие карточки по фиксированным колонкам
      const updatedFixedColumns = fixedColumns.map(col => ({ ...col, cards: [] }));
      data.forEach(backendColumn => {
        backendColumn.cards.forEach(card => {
          const targetCol = updatedFixedColumns.find(fixedCol => fixedCol.name === backendColumn.name);
          if (targetCol) {
            targetCol.cards.push(card);
          } else {
            // Если колонка не найдена, добавляем карточку в первую колонку по умолчанию
            updatedFixedColumns[0].cards.push(card);
          }
        });
      });
      setColumns(updatedFixedColumns);
    } catch (error) {
      showNotification('Ошибка при загрузке колонок.', 'error');
      console.error('Error fetching columns:', error);
      setColumns(fixedColumns); // Устанавливаем фиксированные колонки в случае ошибки
    }
  };

  const handleAddCardAtBoardLevel = () => {
    setModalConfig({
      title: 'Создать новую задачу',
      fields: [
        { id: 'columnId', label: 'Колонка', type: 'select', options: fixedColumns.map(col => ({ value: col.id, label: col.name })), required: true },
        { id: 'cardTitle', label: 'Название задачи', type: 'text', required: true },
        { id: 'cardDescription', label: 'Описание задачи (необязательно)', type: 'textarea', required: false }
      ],
      onSave: async (formData) => {
        const { columnId, cardTitle, cardDescription } = formData;
        if (columnId && cardTitle) {
          try {
            const targetColumn = columns.find(col => col.id === columnId);
            const newCard = await api.createCard(columnId, { title: cardTitle, description: cardDescription, position: targetColumn ? targetColumn.cards.length : 0 });
            if (newCard && newCard.id) {
              showNotification(`Задача "${newCard.title}" успешно создана!`, 'success');
              fetchColumns(); // Перезагрузить колонки, чтобы обновить карточки
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

  return (
    <div>
      <BoardNavigation />
      <div className="board-header">
        <h2>Доска</h2>
        <button className="add-button" onClick={handleAddCardAtBoardLevel}>
          <i className="fas fa-plus"></i> Добавить новую задачу
        </button>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <div className="columns-container">
          <SortableContext items={columns.map(col => col.id)}>
            {columns.map(column => (
              <Column key={column.id} column={column} />
            ))}
          </SortableContext>
        </div>
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
        />
      )}
    </div>
  );
}

export default BoardPage;