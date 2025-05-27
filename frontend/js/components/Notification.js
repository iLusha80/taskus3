class Notification {
    static show(message, type = 'info', duration = 3000) {
        const notificationContainer = Notification.getContainer();
        const notification = document.createElement('div');
        notification.classList.add('notification', `notification-${type}`);
        notification.textContent = message;

        notificationContainer.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('hide');
            notification.addEventListener('transitionend', () => {
                notification.remove();
            });
        }, duration);
    }

    static getContainer() {
        let container = document.querySelector('.notification-container');
        if (!container) {
            container = document.createElement('div');
            container.classList.add('notification-container');
            document.body.appendChild(container);
        }
        return container;
    }
}

export default Notification;