# План по изменению атрибута "Исполнитель"

## Цель
Изменить атрибут "Исполнитель" (assigned_agent_id) в задачах на справочный, подставляемый из отдельной таблицы, и реализовать выпадающий список для выбора исполнителя в модальном окне. Также добавить 5 предопределенных видов исполнителей.

## План реализации

### 1. Создание новой модели для исполнителей (Agents) на бэкенде
*   **Файл:** `backend/models/agent.py`
*   **Описание:** Создать новую модель `Agent` с полями `id` (первичный ключ) и `name` (название роли).
*   **Пример структуры:**
    ```python
    # backend/models/agent.py
    from database import db

    class Agent(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        name = db.Column(db.Text, unique=True, nullable=False)

        def to_dict(self):
            return {
                'id': self.id,
                'name': self.name
            }
    ```
*   **Инициализация данных:** 5 предопределенных видов исполнителей (Менеджер проекта, архитектор, backend-разработчик, frontend-разработчик, devops) будут инициализированы при первом запуске приложения.

### 2. Обновление модели `Card` на бэкенде
*   **Файл:** `backend/models/card.py`
*   **Описание:**
    *   Изменить тип `assigned_agent_id` с `db.Text` на `db.Integer`.
    *   Сделать его внешним ключом, ссылающимся на `Agent.id`.
    *   Добавить связь `db.relationship` для удобного доступа к объекту `Agent`.
    *   Обновить метод `to_dict` для включения имени агента.
*   **Пример изменений:**
    ```python
    # backend/models/card.py (фрагмент)
    from database import db
    from datetime import datetime
    # Импортировать Agent
    from models.agent import Agent # Добавить эту строку

    class Card(db.Model):
        # ... существующие атрибуты ...
        assigned_agent_id = db.Column(db.Integer, db.ForeignKey('agent.id'), nullable=True) # Изменено на Integer и ForeignKey
        # ... существующие атрибуты ...

        # Добавить relationship
        assigned_agent = db.relationship('Agent', backref='cards', lazy=True)

        def to_dict(self):
            return {
                # ... существующие поля ...
                'assigned_agent_id': self.assigned_agent_id,
                'assigned_agent_name': self.assigned_agent.name if self.assigned_agent else None, # Добавлено имя агента
                # ... существующие поля ...
            }
    ```

### 3. Обновление API на бэкенде
*   **Файлы:** `backend/api/cards.py`, `backend/services/card_service.py`, `backend/api/__init__.py`
*   **Описание:**
    *   **`backend/api/cards.py` и `backend/services/card_service.py`:** Обновить логику создания и обновления карточек, чтобы она корректно обрабатывала `assigned_agent_id` как `Integer` (ID агента).
    *   **`backend/api/__init__.py`:** Зарегистрировать новый Blueprint для агентов.
    *   **Новый файл:** `backend/api/agents.py`
        *   Создать новый эндпоинт `/api/agents` для получения списка всех агентов.
*   **Пример `backend/api/agents.py`:**
    ```python
    # backend/api/agents.py
    from flask import Blueprint, jsonify
    from models.agent import Agent

    agents_bp = Blueprint('agents', __name__)

    @agents_bp.route('/agents', methods=['GET'])
    def get_agents():
        agents = Agent.query.all()
        return jsonify([agent.to_dict() for agent in agents])
    ```

### 4. Обновление фронтенда

#### 4.1. `frontend-react/src/pages/BoardPage.jsx`
*   **Описание:**
    *   Добавить состояние `agents` для хранения списка исполнителей.
    *   Загружать список агентов с бэкенда при монтировании компонента.
    *   В `handleAddCardAtBoardLevel` и `handleEditCard` изменить поле `assigned_agent_id` на тип `select` и передать в него список загруженных агентов.
*   **Пример изменений:**
    ```javascript
    // frontend-react/src/pages/BoardPage.jsx (фрагмент)
    import React, { useState, useEffect } from 'react';
    // ... другие импорты ...

    function BoardPage() {
      // ... существующие состояния ...
      const [agents, setAgents] = useState([]); // Новое состояние для агентов

      useEffect(() => {
        if (boardId) {
          fetchColumns();
          fetchMilestonesForProject();
          fetchAgents(); // Загружаем агентов
        }
      }, [boardId]);

      const fetchAgents = async () => {
        try {
          const data = await api.getAgents(); // Предполагается, что api.js будет иметь метод getAgents
          setAgents(data);
        } catch (error) {
          showNotification('Ошибка при загрузке исполнителей.', 'error');
          console.error('Error fetching agents:', error);
        }
      };

      const handleAddCardAtBoardLevel = () => {
        setModalConfig({
          title: 'Создать новую задачу',
          fields: [
            // ... другие поля ...
            {
              id: 'assigned_agent_id',
              label: 'Исполнитель',
              type: 'select',
              options: [{ value: '', label: 'Не назначен' }, ...agents.map(agent => ({ value: agent.id, label: agent.name }))],
              required: false,
              fullWidth: true
            }
          ],
          // ... onSave и onClose ...
        });
        setIsModalOpen(true);
      };

      const handleEditCard = (card) => {
        setEditingCard(card);
        setModalConfig({
          title: `Редактировать задачу: ${card.title}`,
          fields: [
            // ... другие поля ...
            {
              id: 'assigned_agent_id',
              label: 'Исполнитель',
              type: 'select',
              options: [{ value: '', label: 'Не назначен' }, ...agents.map(agent => ({ value: agent.id, label: agent.name }))],
              required: false,
              fullWidth: true,
              defaultValue: card.assigned_agent_id || ''
            },
            // ... другие поля ...
          ],
          // ... onSave и onClose ...
        });
        setIsModalOpen(true);
      };
      // ... остальной код ...
    }
    ```

#### 4.2. `frontend-react/src/components/Modal.jsx`
*   **Описание:** Компонент уже поддерживает тип `select`, поэтому дополнительных изменений не требуется.

#### 4.3. `frontend-react/src/services/api.js`
*   **Описание:** Добавить новый метод `getAgents` для взаимодействия с бэкенд API.
*   **Пример изменений:**
    ```javascript
    // frontend-react/src/services/api.js (фрагмент)
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

    const api = {
      // ... существующие методы ...
      getAgents: async () => {
        const response = await fetch(`${API_BASE_URL}/agents`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      },
      // ... существующие методы ...
    };

    export default api;
    ```

### 5. Миграции базы данных
*   **Описание:** После внесения изменений в модели `Agent` и `Card`, необходимо будет создать и применить миграции базы данных, чтобы обновить схему. Это будет выполнено в режиме `code`.

### 6. Тестирование
*   **Описание:** Проверить создание, редактирование и отображение карточек с новым полем "Исполнитель".

## Mermaid Diagram

```mermaid
graph TD
    A[Пользовательский запрос] --> B{Анализ текущей структуры};
    B --> C[Бэкенд: Создание модели Agent];
    C --> D[Бэкенд: Обновление модели Card];
    D --> E[Бэкенд: Добавление API для Agents];
    E --> F[Фронтенд: Загрузка списка Agents];
    F --> G[Фронтенд: Обновление Modal для выбора Agent];
    G --> H[Фронтенд: Обновление Card для отображения Agent Name];
    H --> I[Миграции базы данных];
    I --> J[Тестирование];