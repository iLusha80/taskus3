import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProjectListPage from './pages/ProjectListPage';
import BoardPage from './pages/BoardPage';
import './App.css'; // Предполагаем, что стили будут здесь

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    if (isDarkTheme) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [isDarkTheme]);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <Router>
      <div id="root-container"> {/* Обертка для flexbox */}
        <header>
          <h1><Link to="/">AI Task Tracker</Link></h1> {/* Изменен текст заголовка */}
          <div className="board-actions">
            {/* Здесь могут быть кнопки для добавления задач/колонок/досок */}
            <button onClick={toggleTheme}>
              Переключить тему ({isDarkTheme ? 'Светлая' : 'Темная'})
            </button>
          </div>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<ProjectListPage />} />
            <Route path="/project/:projectId/board/:boardId" element={<BoardPage />} />
            {/* Добавьте другие маршруты по мере необходимости */}
          </Routes>
        </main>
        <footer>
          <p>&copy; 2023 Taskus. Все права защищены.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
