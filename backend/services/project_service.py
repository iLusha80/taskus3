from database import db
from models.project import Project

class ProjectService:
    @staticmethod
    def get_all_projects():
        return Project.query.all()

    @staticmethod
    def get_project_by_id(project_id):
        return Project.query.get(project_id)

    @staticmethod
    def create_project(name, description, metadata):
        new_project = Project(name=name, description=description, metadata=metadata)
        db.session.add(new_project)
        db.session.commit()
        return new_project

    @staticmethod
    def update_project(project_id, data):
        project = Project.query.get(project_id)
        if not project:
            return None
        
        if 'name' in data:
            project.name = data['name']
        if 'description' in data:
            project.description = data['description']
        if 'metadata' in data:
            project.metadata = data['metadata']
        
        db.session.commit()
        return project

    @staticmethod
    def delete_project(project_id):
        project = Project.query.get(project_id)
        if not project:
            return False
        db.session.delete(project)
        db.session.commit()
        return True