const appRoot = document.getElementById('app-root');
const mainNav = document.getElementById('main-nav');

const router = {
    routes: {},
    init: function() {
        window.addEventListener('popstate', () => this.loadRoute(location.pathname));
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-route]')) {
                e.preventDefault();
                const path = e.target.getAttribute('data-route');
                this.navigate(path);
            }
        });
        // Обрабатываем корневой путь, если location.pathname пуст
        this.loadRoute(location.pathname === '' ? '/' : location.pathname);
    },
    addRoute: function(path, handler) {
        this.routes[path] = handler;
    },
    navigate: function(path) {
        history.pushState({}, '', path);
        this.loadRoute(path);
    },
    loadRoute: async function(path) {
        let handler = null;
        let params = {};

        // Try to match exact path first
        if (this.routes[path]) {
            handler = this.routes[path];
        } else {
            // Try to match dynamic routes
            for (const routePath in this.routes) {
                if (routePath.includes(':')) {
                    const regexPath = routePath.replace(/:\w+/g, '([^/]+)');
                    const match = path.match(new RegExp(`^${regexPath}$`));
                    if (match) {
                        handler = this.routes[routePath];
                        const paramNames = (routePath.match(/:\w+/g) || []).map(p => p.substring(1));
                        paramNames.forEach((name, index) => {
                            params[name] = match[index + 1];
                        });
                        break;
                    }
                }
            }
        }

        if (handler) {
            appRoot.innerHTML = 'Загрузка...'; // Показываем индикатор загрузки
            await handler(params);
        } else {
            appRoot.innerHTML = '<h1>404 - Страница не найдена</h1>';
        }
        this.updateNavigation(path);
    },
    updateNavigation: function(currentPath) {
        mainNav.innerHTML = ''; // Очищаем текущую навигацию
        const ul = document.createElement('ul');

        // Добавляем ссылку на "Проекты"
        const projectsLi = document.createElement('li');
        const projectsLink = document.createElement('a');
        projectsLink.href = '/';
        projectsLink.setAttribute('data-route', '/');
        projectsLink.textContent = 'Проекты';
        if (currentPath === '/') {
            projectsLink.classList.add('active');
        }
        projectsLi.appendChild(projectsLink);
        ul.appendChild(projectsLi);

        // Если мы на доске, добавляем ссылку "Назад к проектам"
        const boardMatch = currentPath.match(/^\/project\/(\d+)\/board\/(\d+)$/);
        if (boardMatch) {
            const projectId = boardMatch[1];
            const boardId = boardMatch[2]; // Пока не используется, но может пригодиться
            const backToProjectsLi = document.createElement('li');
            const backToProjectsLink = document.createElement('a');
            backToProjectsLink.href = '/';
            backToProjectsLink.setAttribute('data-route', '/');
            backToProjectsLink.textContent = '← К проектам';
            backToProjectsLi.appendChild(backToProjectsLink);
            ul.appendChild(backToProjectsLi);
        }

        mainNav.appendChild(ul);
    }
};

window.router = router;