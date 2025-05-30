from database import db
from models.card import Card
from models.column import Column
from models.history import CardHistory
from datetime import datetime

class CardService:
    """Сервис для управления операциями, связанными с карточками.

    Предоставляет статические методы для взаимодействия с моделями Card и CardHistory в базе данных.
    """
    @staticmethod
    def get_cards_by_column(column_id):
        """Получает список карточек для указанной колонки.

        Карточки сортируются по их позиции.

        Args:
            column_id (int): ID колонки.

        Returns:
            list[Card] or None: Список объектов Card, если колонка найдена, иначе None.
        """
        column = Column.query.get(column_id)
        if not column:
            return None
        return Card.query.filter_by(column_id=column_id).order_by(Card.position).all()

    @staticmethod
    def get_card_by_id(card_id):
        """Получает карточку по ее ID.

        Args:
            card_id (int): ID карточки.

        Returns:
            Card or None: Объект Card, если найден, иначе None.
        """
        return Card.query.get(card_id)

    @staticmethod
    def create_card(column_id, title, description, status, priority, assigned_agent_id, task_type, start_date, due_date, position, metadata):
        """Создает новую карточку в базе данных.

        Также добавляет запись в историю о создании карточки.

        Args:
            column_id (int): ID колонки, к которой будет принадлежать карточка.
            title (str): Название карточки.
            description (str): Описание карточки.
            status (str): Статус карточки (по умолчанию 'open').
            priority (str): Приоритет карточки (по умолчанию 'medium').
            assigned_agent_id (str): ID назначенного агента (необязательно).
            task_type (str): Тип задачи (необязательно).
            start_date (str): Дата начала задачи (необязательно, формат YYYY-MM-DD).
            due_date (str): Дата выполнения задачи (необязательно, формат YYYY-MM-DD).
            position (int): Позиция карточки в колонке (по умолчанию 0).
            metadata (str): Дополнительные метаданные карточки в формате JSON-строки.

        Returns:
            Card or None: Созданный объект Card, если колонка найдена, иначе None.
        """
        column = Column.query.get(column_id)
        if not column:
            return None
        new_card = Card(
            column_id=column_id,
            title=title,
            description=description,
            status=status,
            priority=priority,
            assigned_agent_id=assigned_agent_id,
            task_type=task_type,
            start_date=start_date,
            due_date=due_date,
            position=position,
            metadata=metadata
        )
        db.session.add(new_card)
        db.session.commit()

        # Добавляем запись в историю о создании карточки
        history_entry = CardHistory(
            card_id=new_card.id,
            event_type='created',
            new_value='Card created'
        )
        db.session.add(history_entry)
        db.session.commit()
        
        return new_card

    @staticmethod
    def update_card(card_id, data):
        """Обновляет существующую карточку в базе данных.

        Отслеживает изменения в 'column_id' и 'status' и добавляет соответствующие записи в историю.

        Args:
            card_id (int): ID карточки для обновления.
            data (dict): Словарь, содержащий поля для обновления.

        Returns:
            Card or None: Обновленный объект Card, если найден, иначе None.
        """
        card = Card.query.get(card_id)
        if not card:
            return None
 
        history_entries = []
 
        # Сохраняем старые значения для истории
        old_column_id = card.column_id
        old_status = card.status
        old_updated_at = card.updated_at
 
        if 'column_id' in data and data['column_id'] != old_column_id:
            card.column_id = data['column_id']
            history_entries.append({
                'event_type': 'column_change',
                'field_name': 'column_id',
                'old_value': str(old_column_id),
                'new_value': str(data['column_id']),
                'duration_in_seconds': (datetime.now() - datetime.strptime(old_updated_at, '%Y-%m-%d %H:%M:%S')).total_seconds() if old_updated_at else None
            })
        if 'title' in data:
            card.title = data['title']
        if 'description' in data:
            card.description = data['description']
        if 'status' in data and data['status'] != old_status:
            card.status = data['status']
            history_entries.append({
                'event_type': 'status_change',
                'field_name': 'status',
                'old_value': old_status,
                'new_value': data['status'],
                'duration_in_seconds': (datetime.now() - datetime.strptime(old_updated_at, '%Y-%m-%d %H:%M:%S')).total_seconds() if old_updated_at else None
            })
        if 'priority' in data:
            card.priority = data['priority']
        if 'assigned_agent_id' in data:
            card.assigned_agent_id = data['assigned_agent_id']
        if 'task_type' in data:
            card.task_type = data['task_type']
        if 'start_date' in data:
            card.start_date = data['start_date']
        if 'due_date' in data:
            card.due_date = data['due_date']
        if 'position' in data:
            card.position = data['position']
        if 'metadata' in data:
            card.metadata = data['metadata']
        
        db.session.commit()
 
        # Добавляем записи в историю
        for entry in history_entries:
            history_record = CardHistory(
                card_id=card_id,
                event_type=entry['event_type'],
                field_name=entry.get('field_name'),
                old_value=entry.get('old_value'),
                new_value=entry.get('new_value'),
                duration_in_seconds=entry.get('duration_in_seconds'),
                metadata=entry.get('metadata', '{}')
            )
            db.session.add(history_record)
        db.session.commit()
 
        return card

    @staticmethod
    def delete_card(card_id):
        """Удаляет карточку из базы данных.

        Args:
            card_id (int): ID карточки для удаления.

        Returns:
            bool: True, если карточка успешно удалена, иначе False.
        """
        card = Card.query.get(card_id)
        if not card:
            return False
        db.session.delete(card)
        db.session.commit()
        return True

    @staticmethod
    def get_card_history(card_id):
        """Получает историю изменений для указанной карточки.

        История сортируется по временной метке.

        Args:
            card_id (int): ID карточки.

        Returns:
            list[CardHistory] or None: Список объектов CardHistory, если карточка найдена, иначе None.
        """
        card = Card.query.get(card_id)
        if not card:
            return None
        return CardHistory.query.filter_by(card_id=card_id).order_by(CardHistory.timestamp).all()