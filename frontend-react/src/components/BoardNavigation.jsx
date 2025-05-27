import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useNotification } from '../contexts/NotificationContext';
import './BoardNavigation.css'; // Создадим этот файл позже

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
    <nav className="main-nav">
      <ul>
        <li>
          <button onClick={() => navigate('/')} className="button secondary">
            ← К проектам
          </button>
        </li>
        {projectName && <li><h3>Проект: {projectName}</h3></li>}
        {boards.length > 0 ? (
          boards.map(board => (
            <li key={board.id}>
              <button
                onClick={() => handleBoardClick(board.id)}
                className={`button ${board.id == boardId ? 'active-board' : ''}`}
              >
                {board.name}
              </button>
            </li>
          ))
        ) : (
          <li><p>Нет досок</p></li>
        )}
      </ul>
    </nav>
  );
}

export default BoardNavigation;