import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../services/api';
import Modal from '../components/Modal';
import { useNotification } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import StyledButton from '../components/StyledButton'; // Import StyledButton
import { FaPlus } from 'react-icons/fa'; // Import plus icon

const ProjectListPageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.medium};
`;

const PageTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.heading2.fontSize};
  font-weight: ${({ theme }) => theme.typography.heading2.fontWeight};
  margin-top: 0;
  margin-bottom: ${({ theme }) => theme.spacing.large};
  text-align: center;
`;

const ProjectListGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.medium};

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ProjectCard = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.grayLight};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: ${({ theme }) => theme.spacing.medium};
  box-shadow: ${({ theme }) => theme.boxShadow.medium};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-8px);
    box-shadow: ${({ theme }) => theme.boxShadow.large};
  }
`;

const ProjectCardTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.heading3.fontSize};
  font-weight: ${({ theme }) => theme.typography.heading3.fontWeight};
  margin-top: 0;
  margin-bottom: ${({ theme }) => theme.spacing.small};
  text-align: left;
`;

const ProjectCardDescription = styled.p`
  color: ${({ theme }) => theme.colors.grayDark};
  font-size: ${({ theme }) => theme.typography.small.fontSize};
  line-height: ${({ theme }) => theme.typography.body.lineHeight};
  flex-grow: 1;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const NoProjectsMessage = styled.p`
  color: ${({ theme }) => theme.colors.grayDark};
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.medium};
`;


function ProjectListPage({ handleAddProject, isModalOpen, modalConfig, setIsModalOpen, setModalConfig }) {
  const [projects, setProjects] = useState([]);
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

  const handleProjectCardClick = async (projectId) => {
    try {
      const boards = await api.getBoards(projectId);
      if (boards && boards.length > 0) {
        navigate(`/project/${projectId}/board/${boards[0].id}`);
      } else {
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
    <ProjectListPageContainer>
      {/* Assuming handleAddProject is passed down and triggers a modal */}
      {/* Add Project Button - using StyledButton */}
      <StyledButton onClick={handleAddProject}>
        <FaPlus /> Добавить новый проект
      </StyledButton>

      <PageTitle>Проекты</PageTitle>
      <ProjectListGrid>
        {projects.length > 0 ? (
          projects.map(project => (
            <ProjectCard key={project.id} onClick={() => handleProjectCardClick(project.id)}>
              <ProjectCardTitle>{project.name}</ProjectCardTitle>
              <ProjectCardDescription>{project.description || 'Нет описания'}</ProjectCardDescription>
            </ProjectCard>
          ))
        ) : (
          <NoProjectsMessage>Пока нет проектов. Создайте первый!</NoProjectsMessage>
        )}
      </ProjectListGrid>

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
    </ProjectListPageContainer>
  );
}

export default ProjectListPage;