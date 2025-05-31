import requests

class BaseApiClient:
    """
    Базовый клиент для взаимодействия с API.

    Предоставляет общую логику для выполнения HTTP-запросов и обработки ошибок.
    """

    def __init__(self, base_url):
        """
        Инициализирует BaseApiClient.

        Args:
            base_url (str): Базовый URL для всех запросов API.
        """
        self.base_url = base_url

    def _make_request(self, method, endpoint, data=None):
        """
        Выполняет HTTP-запрос к API.

        Args:
            method (str): HTTP-метод (например, 'GET', 'POST', 'PUT').
            endpoint (str): Конечная точка API (например, '/projects').
            data (dict, optional): Данные для отправки в теле запроса. По умолчанию None.

        Returns:
            dict: JSON-ответ от API.

        Raises:
            requests.exceptions.RequestException: Если запрос не удался или вернул ошибку.
        """
        url = f"{self.base_url}{endpoint}"
        print(f"Выполнение {method} запроса к: {url}")
        try:
            if method == 'GET':
                response = requests.get(url)
            elif method == 'POST':
                response = requests.post(url, json=data)
            elif method == 'PUT':
                response = requests.put(url, json=data)
            else:
                raise ValueError(f"Неподдерживаемый HTTP-метод: {method}")

            response.raise_for_status()  # Вызывает исключение для кодов состояния HTTP ошибок
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Ошибка при выполнении API запроса: {e}")
            if e.response is not None:
                print(f"Статус код: {e.response.status_code}")
                print(f"Ответ сервера: {e.response.text}")
            raise