import React, { useState } from 'react'; // Removed useEffect
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProjectListPage from './pages/ProjectListPage';
import BoardPage from './pages/BoardPage';
import Modal from './components/Modal'; // Import Modal
import { useNotification } from './contexts/NotificationContext'; // Import useNotification
import api from './services/api'; // Import api
import './App.css'; // Предполагаем, что стили будут здесь

function App() {
  // Removed theme state and effect
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [modalConfig, setModalConfig] = useState({}); // Modal config
  const { showNotification } = useNotification(); // Notification context

  // Function to handle adding a new project (moved from ProjectListPage)
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
              // Need to trigger project list refresh in ProjectListPage
              // This will be handled by passing a refresh function or refetching in App
              // For now, just show notification
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


  return (
    <Router>
      <div id="root-container"> {/* Обертка для flexbox */}
        <header>
          <h1><Link to="/">AI Task Tracker</Link></h1> {/* Изменен текст заголовка */}
          <div className="board-actions">
            {/* Кнопка "Добавить новый проект" */}
            <button className="add-button add-project-button" onClick={handleAddProject}>
              <i className="fas fa-plus"></i> Добавить новый проект
            </button>
            {/* Removed theme toggle button */}
          </div>
        </header>
        <main>
          <Routes>
            {/* Pass modal related props to ProjectListPage */}
            <Route
              path="/"
              element={
                <ProjectListPage
                  handleAddProject={handleAddProject} // Pass the function
                  isModalOpen={isModalOpen} // Pass the state
                  modalConfig={modalConfig} // Pass the config
                  setIsModalOpen={setIsModalOpen} // Pass the setter
                  setModalConfig={setModalConfig} // Pass the setter
                />
              }
            />
            <Route path="/project/:projectId/board/:boardId" element={<BoardPage />} />
            {/* Добавьте другие маршруты по мере необходимости */}
          </Routes>
        </main>
        <footer>
          <p>&copy; 2023 Taskus. Все права защищены.</p>
        </footer>
        {/* Modal component */}
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
    </Router>
  );
}

export default App;
