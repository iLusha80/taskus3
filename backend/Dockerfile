# Используем официальный образ Python
FROM python:3.13-slim-bookworm

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app
ENV PYTHONPATH /app

# Копируем файл зависимостей и устанавливаем их
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем остальной код приложения
COPY . .
# Открываем порт, на котором будет работать Flask/Gunicorn
EXPOSE 5000

# Команда для запуска Gunicorn
# Предполагается, что ваше Flask-приложение находится в файле app.py и называется 'app'
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]