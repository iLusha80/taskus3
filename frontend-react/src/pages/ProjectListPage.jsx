import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import { useNotification } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom'; // Оставляем useNavigate для перехода
import './ProjectListPage.css';

function ProjectListPage() {
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({});
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (error) {
      showNotification('Ошибка при загрузке проектов.', 'error');
      console.error('Error fetching projects:', error);
    }
  };

  const handleAddProject = () => {
    setModalConfig({
      title: 'Создать новый проект',
      fields: [
        { id: 'projectName', label: 'Название проекта', type: 'text', required: true },
        { id: 'projectDescription', label: 'Описание проекта (необязательно)', type: 'textarea', required: false }
      ],
      onSave: async (formData) => {
        const { projectName, projectDescription } = formData;
        if (projectName) {
          try {
            const newProject = await api.createProject({ name: projectName, description: projectDescription });
            if (newProject && newProject.id) {
              showNotification(`Проект "${newProject.name}" успешно создан!`, 'success');
              fetchProjects(); // Перезагружаем список проектов
            } else {
              showNotification('Ошибка при создании проекта.', 'error');
            }
          } catch (error) {
            showNotification('Ошибка при создании проекта.', 'error');
            console.error('Error creating project:', error);
          }
        }
      },
      onClose: () => setIsModalOpen(false)
    });
    setIsModalOpen(true);
  };

  // Удалены функции handleViewProject и handleDeleteProject

  const handleProjectCardClick = async (projectId) => {
    try {
      const boards = await api.getBoards(projectId);
      if (boards && boards.length > 0) {
        navigate(`/project/${projectId}/board/${boards[0].id}`);
      } else {
        // Если досок нет, предлагаем создать новую
         setModalConfig({
          title: 'Создать новую доску',
          message: 'У этого проекта пока нет досок. Создать новую доску?',
          fields: [
            { id: 'boardName', label: 'Название доски', type: 'text', required: true }
          ],
          onSave: async (formData) => {
            const { boardName } = formData;
            if (boardName) {
              try {
                const newBoard = await api.createBoard(projectId, { name: boardName });
                if (newBoard && newBoard.id) {
                  showNotification(`Доска "${newBoard.name}" успешно создана!`, 'success');
                  navigate(`/project/${projectId}/board/${newBoard.id}`);
                } else {
                  showNotification('Ошибка при создании доски.', 'error');
                }
              } catch (error) {
                showNotification('Ошибка при создании доски.', 'error');
                console.error('Error creating board:', error);
              }
            }
          },
          onClose: () => setIsModalOpen(false)
        });
        setIsModalOpen(true);
      }
    } catch (error) {
      showNotification('Ошибка при загрузке досок проекта.', 'error');
      console.error('Error fetching boards for project:', error);
    }
  };


  return (
    <div>
      {/* Кнопка "Добавить новый проект" перемещена наверх */}
      <button className="add-button add-project-button" onClick={handleAddProject}>
        <i className="fas fa-plus"></i> Добавить новый проект
      </button>

      <h2>Проекты</h2> {/* Заголовок остается, но будет центрирован через CSS */}
      <div className="project-list">
        {projects.length > 0 ? (
          projects.map(project => (
            // Добавлен onClick для перехода на страницу деталей проекта
            <div key={project.id} className="project-card" onClick={() => handleProjectCardClick(project.id)}>
              <h2>{project.name}</h2>
              <p>{project.description || 'Нет описания'}</p>
              {/* Удалены кнопки "Открыть доски" и "Удалить" */}
            </div>
          ))
        ) : (
          <p>Пока нет проектов. Создайте первый!</p>
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

export default ProjectListPage;