const HistoryView = {
    render: async (cardId, containerElement) => {
        containerElement.innerHTML = '<p>Загрузка истории...</p>';
        try {
            const history = await api.getCardHistory(cardId);
            if (history && history.length > 0) {
                const ul = document.createElement('ul');
                ul.className = 'card-history-list';
                history.forEach(entry => {
                    const li = document.createElement('li');
                    let message = '';
                    switch (entry.event_type) {
                        case 'created':
                            message = `Задача создана.`;
                            break;
                        case 'column_change':
                            message = `Перемещена из колонки <strong>${entry.old_value}</strong> в <strong>${entry.new_value}</strong>.`;
                            if (entry.duration_in_seconds) {
                                message += ` Находилась в предыдущей колонке: ${formatDuration(entry.duration_in_seconds)}.`;
                            }
                            break;
                        case 'status_change':
                            message = `Статус изменен с <strong>${entry.old_value}</strong> на <strong>${entry.new_value}</strong>.`;
                            if (entry.duration_in_seconds) {
                                message += ` Находилась в предыдущем статусе: ${formatDuration(entry.duration_in_seconds)}.`;
                            }
                            break;
                        case 'updated':
                            message = `Поле <strong>${entry.field_name}</strong> изменено с "${entry.old_value}" на "${entry.new_value}".`;
                            break;
                        default:
                            message = `Событие: ${entry.event_type}`;
                            if (entry.field_name) message += ` (${entry.field_name})`;
                            break;
                    }
                    li.innerHTML = `
                        ${message}
                        <span class="timestamp">${new Date(entry.timestamp).toLocaleString()}</span>
                    `;
                    ul.appendChild(li);
                });
                containerElement.innerHTML = '';
                containerElement.appendChild(ul);
            } else {
                containerElement.innerHTML = '<p>История изменений отсутствует.</p>';
            }
        } catch (error) {
            console.error('Ошибка при загрузке истории карточки:', error);
            containerElement.innerHTML = '<p>Не удалось загрузить историю.</p>';
        }
    }
};

// Вспомогательная функция для форматирования длительности
function formatDuration(seconds) {
    if (seconds === null) return 'N/A';
    const days = Math.floor(seconds / (3600 * 24));
    seconds %= (3600 * 24);
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    let result = [];
    if (days > 0) result.push(`${days} дн.`);
    if (hours > 0) result.push(`${hours} ч.`);
    if (minutes > 0) result.push(`${minutes} мин.`);
    if (remainingSeconds > 0 || result.length === 0) result.push(`${remainingSeconds} сек.`);

    return result.join(' ');
}

window.HistoryView = HistoryView;