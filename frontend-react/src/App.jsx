import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProjectListPage from './pages/ProjectListPage';
import BoardPage from './pages/BoardPage';
import './App.css'; // Предполагаем, что стили будут здесь

function App() {
  return (
    <Router>
      <div id="root-container"> {/* Обертка для flexbox */}
        <header>
          <h1><Link to="/">Taskus</Link></h1>
          <div className="board-actions">
            {/* Здесь могут быть кнопки для добавления задач/колонок/досок */}
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
