from models.milestone import Milestone
from models.objective import Objective
from database import db
from datetime import datetime

class MilestoneService:
    """Сервис для управления этапами (Milestone)."""

    @staticmethod
    def create_milestone(objective_id, name, description=None, due_date=None):
        """Создает новый этап.

        Args:
            objective_id (int): ID цели, к которой относится этап.
            name (str): Название этапа.
            description (str, optional): Описание этапа.
            due_date (str, optional): Целевая дата завершения этапа.

        Returns:
            Milestone: Созданный объект этапа, или None, если цель не найдена.
        """
        objective = Objective.query.get(objective_id)
        if not objective:
            return None

        new_milestone = Milestone(
            objective_id=objective_id,
            name=name,
            description=description,
            status='not_started',
            due_date=due_date
        )
        db.session.add(new_milestone)
        db.session.commit()
        return new_milestone

    @staticmethod
    def get_milestone_by_id(milestone_id):
        """Получает этап по его ID.

        Args:
            milestone_id (int): ID этапа.

        Returns:
            Milestone: Объект этапа, или None, если этап не найден.
        """
        return Milestone.query.get(milestone_id)

    @staticmethod
    def get_milestones_by_objective(objective_id):
        """Получает все этапы для указанной цели.

        Args:
            objective_id (int): ID цели.

        Returns:
            list: Список объектов Milestone.
        """
        return Milestone.query.filter_by(objective_id=objective_id).all()

    @staticmethod
    def get_milestones_by_project(project_id):
        """Получает все этапы для указанного проекта.

        Args:
            project_id (int): ID проекта.

        Returns:
            list: Список объектов Milestone.
        """
        from models.objective import Objective # Импортируем здесь, чтобы избежать циклической зависимости
        objectives = Objective.query.filter_by(project_id=project_id).all()
        all_milestones = []
        for objective in objectives:
            milestones = Milestone.query.filter_by(objective_id=objective.id).all()
            all_milestones.extend(milestones)
        return all_milestones

    @staticmethod
    def update_milestone(milestone_id, data):
        """Обновляет существующий этап.

        Args:
            milestone_id (int): ID этапа.
            data (dict): Словарь с данными для обновления.

        Returns:
            Milestone: Обновленный объект этапа, или None, если этап не найден.
        """
        milestone = Milestone.query.get(milestone_id)
        if not milestone:
            return None

        for key, value in data.items():
            if hasattr(milestone, key):
                setattr(milestone, key, value)
        
        milestone.updated_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        db.session.commit()
        return milestone

    @staticmethod
    def delete_milestone(milestone_id):
        """Удаляет этап по его ID.

        Args:
            milestone_id (int): ID этапа.

        Returns:
            bool: True, если этап успешно удален, False в противном случае.
        """
        milestone = Milestone.query.get(milestone_id)
        if milestone:
            db.session.delete(milestone)
            db.session.commit()
            return True
        return False