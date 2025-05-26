const API_BASE_URL = 'http://localhost:5000/api/v1';

const api = {
    // Projects
    getProjects: async () => {
        const response = await fetch(`${API_BASE_URL}/projects`);
        return response.json();
    },
    createProject: async (projectData) => {
        const response = await fetch(`${API_BASE_URL}/projects/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectData)
        });
        return response.json();
    },
    getProject: async (projectId) => {
        const response = await fetch(`${API_BASE_URL}/projects/${projectId}`);
        return response.json();
    },
    updateProject: async (projectId, projectData) => {
        const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectData)
        });
        return response.json();
    },
    deleteProject: async (projectId) => {
        const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
            method: 'DELETE'
        });
        return response.status === 204;
    },

    // Boards
    getBoards: async (projectId) => {
        const response = await fetch(`${API_BASE_URL}/projects/${projectId}/boards`);
        return response.json();
    },
    createBoard: async (projectId, boardData) => {
        const response = await fetch(`${API_BASE_URL}/projects/${projectId}/boards`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(boardData)
        });
        return response.json();
    },
    getBoard: async (boardId) => {
        const response = await fetch(`${API_BASE_URL}/boards/${boardId}`);
        return response.json();
    },
    updateBoard: async (boardId, boardData) => {
        const response = await fetch(`${API_BASE_URL}/boards/${boardId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(boardData)
        });
        return response.json();
    },
    deleteBoard: async (boardId) => {
        const response = await fetch(`${API_BASE_URL}/boards/${boardId}`, {
            method: 'DELETE'
        });
        return response.status === 204;
    },

    // Columns
    getColumns: async (boardId) => {
        const response = await fetch(`${API_BASE_URL}/boards/${boardId}/columns`);
        return response.json();
    },
    createColumn: async (boardId, columnData) => {
        const response = await fetch(`${API_BASE_URL}/boards/${boardId}/columns`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(columnData)
        });
        return response.json();
    },
    getColumn: async (columnId) => {
        const response = await fetch(`${API_BASE_URL}/columns/${columnId}`);
        return response.json();
    },
    updateColumn: async (columnId, columnData) => {
        const response = await fetch(`${API_BASE_URL}/columns/${columnId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(columnData)
        });
        return response.json();
    },
    deleteColumn: async (columnId) => {
        const response = await fetch(`${API_BASE_URL}/columns/${columnId}`, {
            method: 'DELETE'
        });
        return response.status === 204;
    },

    // Cards
    getCards: async (columnId) => {
        const response = await fetch(`${API_BASE_URL}/columns/${columnId}/cards`);
        return response.json();
    },
    createCard: async (columnId, cardData) => {
        const response = await fetch(`${API_BASE_URL}/columns/${columnId}/cards`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cardData)
        });
        return response.json();
    },
    getCard: async (cardId) => {
        const response = await fetch(`${API_BASE_URL}/cards/${cardId}`);
        return response.json();
    },
    updateCard: async (cardId, cardData) => {
        const response = await fetch(`${API_BASE_URL}/cards/${cardId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cardData)
        });
        return response.json();
    },
    deleteCard: async (cardId) => {
        const response = await fetch(`${API_BASE_URL}/cards/${cardId}`, {
            method: 'DELETE'
        });
        return response.status === 204;
    },

    // Card History
    getCardHistory: async (cardId) => {
        const response = await fetch(`${API_BASE_URL}/cards/${cardId}/history`);
        return response.json();
    }
};

// Добавляем глобальный обработчик ошибок для fetch
window.addEventListener('unhandledrejection', event => {
    console.error('Unhandled promise rejection:', event.reason);
    // Здесь можно добавить логику для отображения сообщения об ошибке пользователю
    alert('Произошла ошибка: ' + event.reason.message || event.reason);
});

// Экспортируем объект api для использования в других модулях
window.api = api;