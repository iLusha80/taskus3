from models.objective import Objective
from models.project import Project
from database import db
from datetime import datetime

class ObjectiveService:
    """Сервис для управления целями (Objective)."""

    @staticmethod
    def create_objective(project_id, name, description=None, owner_agent_id=None, start_date=None, target_date=None):
        """Создает новую цель.

        Args:
            project_id (int): ID проекта, к которому относится цель.
            name (str): Название цели.
            description (str, optional): Описание цели.
            owner_agent_id (str, optional): ID главного агента, ответственного за цель.
            start_date (str, optional): Дата начала цели.
            target_date (str, optional): Целевая дата завершения цели.

        Returns:
            Objective: Созданный объект цели, или None, если проект не найден.
        """
        project = Project.query.get(project_id)
        if not project:
            return None

        new_objective = Objective(
            project_id=project_id,
            name=name,
            description=description,
            status='not_started',
            owner_agent_id=owner_agent_id,
            start_date=start_date,
            target_date=target_date
        )
        db.session.add(new_objective)
        db.session.commit()
        return new_objective

    @staticmethod
    def get_objective_by_id(objective_id):
        """Получает цель по ее ID.

        Args:
            objective_id (int): ID цели.

        Returns:
            Objective: Объект цели, или None, если цель не найдена.
        """
        return Objective.query.get(objective_id)

    @staticmethod
    def get_objectives_by_project(project_id):
        """Получает все цели для указанного проекта.

        Args:
            project_id (int): ID проекта.

        Returns:
            list: Список объектов Objective.
        """
        return Objective.query.filter_by(project_id=project_id).all()

    @staticmethod
    def update_objective(objective_id, data):
        """Обновляет существующую цель.

        Args:
            objective_id (int): ID цели.
            data (dict): Словарь с данными для обновления.

        Returns:
            Objective: Обновленный объект цели, или None, если цель не найдена.
        """
        objective = Objective.query.get(objective_id)
        if not objective:
            return None

        for key, value in data.items():
            if hasattr(objective, key):
                setattr(objective, key, value)
        
        objective.updated_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        db.session.commit()
        return objective

    @staticmethod
    def delete_objective(objective_id):
        """Удаляет цель по ее ID.

        Args:
            objective_id (int): ID цели.

        Returns:
            bool: True, если цель успешно удалена, False в противном случае.
        """
        objective = Objective.query.get(objective_id)
        if objective:
            db.session.delete(objective)
            db.session.commit()
            return True
        return False