import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useNotification } from '../contexts/NotificationContext';
import StyledButton from './StyledButton'; // Import StyledButton
import { FaArrowLeft } from 'react-icons/fa'; // Import left arrow icon

const MainNav = styled.nav`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  padding: ${({ theme }) => theme.spacing.xsmall} ${({ theme }) => theme.spacing.small};
  border-bottom: 1px solid ${({ theme }) => theme.colors.grayLight};
  box-shadow: ${({ theme }) => theme.boxShadow.small};
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium}; /* Increased gap */
  flex-wrap: wrap; /* Allow wrapping on smaller screens */
`;

const NavItem = styled.li`
  display: inline-block;
`;

const ProjectNameHeading = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.body.fontSize};
  font-weight: ${({ theme }) => theme.typography.heading3.fontWeight};
`;

const BoardButton = styled(StyledButton)`
  background-color: ${({ theme }) => theme.colors.grayLight};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium};
  font-weight: 500;

  &:hover {
    background-color: ${({ theme }) => theme.colors.grayMedium};
    color: ${({ theme }) => theme.colors.white};
  }

  &.active {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    font-weight: bold;
    &:hover {
       background-color: ${({ theme }) => theme.colors.primary};
       opacity: 0.9;
    }
  }
`;

const NoBoardsMessage = styled.p`
  color: ${({ theme }) => theme.colors.grayDark};
  margin: 0;
`;


function BoardNavigation() {
  const { projectId, boardId } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [boards, setBoards] = useState([]);
  const [projectName, setProjectName] = useState('');

  useEffect(() => {
    if (projectId) {
      fetchProjectAndBoards(projectId);
    }
  }, [projectId]);

  const fetchProjectAndBoards = async (currentProjectId) => {
    try {
      const projectData = await api.getProject(currentProjectId);
      setProjectName(projectData.name);
      const boardsData = await api.getBoards(currentProjectId);
      setBoards(boardsData);
    } catch (error) {
      showNotification('Ошибка при загрузке навигации по доскам.', 'error');
      console.error('Error fetching board navigation data:', error);
    }
  };

  const handleBoardClick = (id) => {
    navigate(`/project/${projectId}/board/${id}`);
  };

  return (
    <MainNav>
      <NavList>
        <NavItem>
          <StyledButton onClick={() => navigate('/')} className="secondary"> {/* Use StyledButton with secondary class */}
            <FaArrowLeft /> К проектам
          </StyledButton>
        </NavItem>
        {projectName && <NavItem><ProjectNameHeading>Проект: {projectName}</ProjectNameHeading></NavItem>}
        {boards.length > 0 ? (
          boards.map(board => (
            <NavItem key={board.id}>
              <BoardButton
                onClick={() => handleBoardClick(board.id)}
                className={board.id == boardId ? 'active' : ''} // Use 'active' class
              >
                {board.name}
              </BoardButton>
            </NavItem>
          ))
        ) : (
          <NavItem><NoBoardsMessage>Нет досок</NoBoardsMessage></NavItem>
        )}
      </NavList>
    </MainNav>
  );
}

export default BoardNavigation;