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

  const fetchColumns = async () => {
    try {
      const data = await api.getColumns(boardId);
      setColumns(data);
    } catch (error) {
      showNotification('Ошибка при загрузке колонок.', 'error');
      console.error('Error fetching columns:', error);
    }
  };

  const handleAddColumn = () => {
    setModalConfig({
      title: 'Создать новую колонку',
      fields: [
        { id: 'columnName', label: 'Название колонки', type: 'text', required: true }
      ],
      onSave: async (formData) => {
        const { columnName } = formData;
        if (columnName) {
          try {
            const newColumn = await api.createColumn(boardId, { name: columnName });
            if (newColumn && newColumn.id) {
              showNotification(`Колонка "${newColumn.name}" успешно создана!`, 'success');
              fetchColumns();
            } else {
              showNotification('Ошибка при создании колонки.', 'error');
            }
          } catch (error) {
            showNotification('Ошибка при создании колонки.', 'error');
            console.error('Error creating column:', error);
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
        <button className="add-button" onClick={handleAddColumn}>
          <i className="fas fa-plus"></i> Добавить новую колонку
        </button>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <div className="columns-container">
          <SortableContext items={columns.map(col => col.id)}>
            {columns.length > 0 ? (
              columns.map(column => (
                <Column key={column.id} column={column} />
              ))
            ) : (
              <p>Пока нет колонок. Создайте первую!</p>
            )}
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