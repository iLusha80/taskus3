import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import styled from 'styled-components'; // Import styled
import ProjectListPage from './pages/ProjectListPage';
import BoardPage from './pages/BoardPage';
import Modal from './components/Modal';
import { useNotification } from './contexts/NotificationContext';
import api from './services/api';
// Removed import './App.css'; // Assuming styles will be handled by styled-components

// Styled components for Header and Footer
const StyledHeader = styled.header`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium};
  border-bottom: 1px solid ${({ theme }) => theme.colors.grayLight};
  box-shadow: ${({ theme }) => theme.boxShadow.small};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoPlaceholder = styled.div`
  width: 40px;
  height: 40px;
  background-color: ${({ theme }) => theme.colors.primary};
  margin-right: ${({ theme }) => theme.spacing.small};
  /* Add logo styling here later */
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.heading2.fontSize};
  font-weight: ${({ theme }) => theme.typography.heading2.fontWeight};

  a {
    color: ${({ theme }) => theme.colors.text};
    text-decoration: none;

    &:hover {
      text-decoration: none;
    }
  }
`;

const StyledFooter = styled.footer`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium};
  border-top: 1px solid ${({ theme }) => theme.colors.grayLight};
  box-shadow: ${({ theme }) => theme.boxShadow.small}; /* Add box-shadow for consistency */
  text-align: center;
  color: ${({ theme }) => theme.colors.grayDark};
  font-size: ${({ theme }) => theme.typography.small.fontSize};
`;


function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({});
  const { showNotification } = useNotification();

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
      <div id="root-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}> {/* Обертка для flexbox и фиксации футера */}
        <StyledHeader> {/* Use styled header */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <LogoPlaceholder /> {/* Logo placeholder */}
            <HeaderTitle><Link to="/">AI Task Tracker</Link></HeaderTitle> {/* Styled title */}
          </div>
        </StyledHeader>
        <main style={{ flexGrow: 1 }}> {/* Основной контент занимает все доступное пространство */}
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
        <StyledFooter> {/* Use styled footer */}
          <p>&copy; 2023 Taskus. Все права защищены.</p>
        </StyledFooter>
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
