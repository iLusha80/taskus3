const Modal = {
    modalOverlay: null,
    modalContent: null,
    onSaveCallback: null,
    onDeleteCallback: null,

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

    open: function({ title, content, onSave, onDelete }) {
        if (!this.modalOverlay) {
            this.init();
        }

        this.modalContent.innerHTML = `
            <button class="close-button">&times;</button>
            <h2>${title}</h2>
            <div class="modal-body">${content}</div>
        `;
        this.modalOverlay.classList.remove('hidden');

        this.onSaveCallback = onSave;
        this.onDeleteCallback = onDelete;

        // Добавляем обработчики для кнопок внутри модального окна
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
                if (this.onDeleteCallback) {
                    const shouldClose = await this.onDeleteCallback();
                    if (shouldClose) {
                        this.close();
                    }
                }
            });
        }
    },

    close: function() {
        this.modalOverlay.classList.add('hidden');
        this.onSaveCallback = null;
        this.onDeleteCallback = null;
    }
};

// Инициализируем модальное окно при загрузке скрипта
Modal.init();

window.Modal = Modal;