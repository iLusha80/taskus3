const Modal = {
    modalOverlay: null,
    modalContent: null,
    onSaveCallback: null,
    onConfirmCallback: null,
    onOpenCallback: null,

    init: function() {
        this.modalOverlay = document.createElement('div');
        this.modalOverlay.className = 'modal-overlay hidden';
        document.body.appendChild(this.modalOverlay);

        this.modalContent = document.createElement('div');
        this.modalContent.className = 'modal-content';
        this.modalOverlay.appendChild(this.modalContent);

        this.modalOverlay.addEventListener('click', (e) => {
            if (e.target === this.modalOverlay) {
                this.close();
            }
        });
    },

    show: function({ title, message, fields, onSave, onConfirm, isConfirm = false, onOpen, autoClose = false }) {
        if (!this.modalOverlay) {
            this.init();
        }

        this.onSaveCallback = onSave;
        this.onConfirmCallback = onConfirm;
        this.onOpenCallback = onOpen;

        let formHtml = '';
        if (fields && fields.length > 0) {
            formHtml = '<form id="modal-form">';
            fields.forEach(field => {
                formHtml += `
                    <label for="${field.id}">${field.label}:</label>
                    ${field.type === 'textarea' ?
                        `<textarea id="${field.id}" name="${field.id}" ${field.required ? 'required' : ''}></textarea>` :
                        `<input type="${field.type}" id="${field.id}" name="${field.id}" ${field.required ? 'required' : ''}>`
                    }
                `;
            });
            formHtml += '</form>';
        }

        this.modalContent.innerHTML = `
            <button class="close-button">&times;</button>
            <h2>${title}</h2>
            ${message ? `<p>${message}</p>` : ''}
            <div class="modal-body">${formHtml}</div>
            <div class="modal-actions">
                ${isConfirm ?
                    `<button class="save-button confirm-button">Подтвердить</button>` :
                    `<button class="save-button">Сохранить</button>`
                }
                <button class="cancel-button">Отмена</button>
            </div>
        `;
        this.modalOverlay.classList.remove('hidden');

        this.modalContent.querySelector('.close-button').addEventListener('click', this.close.bind(this));
        this.modalContent.querySelector('.cancel-button').addEventListener('click', this.close.bind(this));

        const saveButton = this.modalContent.querySelector('.save-button');
        if (saveButton) {
            saveButton.addEventListener('click', async (e) => {
                e.preventDefault();
                if (isConfirm && this.onConfirmCallback) {
                    await this.onConfirmCallback();
                    this.close();
                } else if (this.onSaveCallback) {
                    const form = this.modalContent.querySelector('#modal-form');
                    const formData = new FormData(form);
                    const data = {};
                    fields.forEach(field => {
                        data[field.id] = formData.get(field.id);
                    });
                    const shouldClose = await this.onSaveCallback(data);
                    if (shouldClose !== false && !autoClose) { // Если onSaveCallback явно не вернул false и не autoClose, закрываем
                        this.close();
                    }
                }
            });
        }

        if (this.onOpenCallback) {
            this.onOpenCallback();
        }

        if (autoClose) {
            setTimeout(() => {
                this.close();
            }, 3000); // Закрыть через 3 секунды
        }
    },

    open: function({ title, content, onSave, onDelete, onOpen }) { // Сохраняем старый метод open для совместимости
        console.log('Modal.open called with title:', title); // Лог для отладки
        if (!this.modalOverlay) {
            this.init();
        }

        this.onSaveCallback = onSave;
        this.onOpenCallback = onOpen;

        this.modalContent.innerHTML = `
            <button class="close-button">&times;</button>
            <h2>${title}</h2>
            <div class="modal-body">${content}</div>
        `;
        this.modalOverlay.classList.remove('hidden');

        this.modalContent.querySelector('.close-button').addEventListener('click', this.close.bind(this));

        const saveButton = this.modalContent.querySelector('.save-button');
        if (saveButton) {
            saveButton.addEventListener('click', async (e) => {
                e.preventDefault();
                if (this.onSaveCallback) {
                    const shouldClose = await this.onSaveCallback();
                    if (shouldClose) {
                        this.close();
                    }
                }
            });
        }

        const deleteButton = this.modalContent.querySelector('.delete-button');
        if (deleteButton) {
            deleteButton.addEventListener('click', async (e) => {
                e.preventDefault();
                if (onDelete) { // Используем onDelete напрямую из параметров open
                    const shouldClose = await onDelete();
                    if (shouldClose) {
                        this.close();
                    }
                }
            });
        }

        if (this.onOpenCallback) {
            this.onOpenCallback();
        }
    },

    close: function() {
        this.modalOverlay.classList.add('hidden');
        this.onSaveCallback = null;
        this.onConfirmCallback = null;
        this.onOpenCallback = null;
    }
};

Modal.init();

window.Modal = Modal;