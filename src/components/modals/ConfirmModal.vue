<template>
    <!-- Confirm Modal -->
    <div class="modal fade confirm-modal-overlay" ref="confirmModal" tabindex="-1" aria-hidden="true"
        data-bs-backdrop="static">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content confirm-modal-content">
                <div class="modal-header confirm-modal-header">
                    <h5 class="modal-title">
                        <i :class="iconClass" class="me-2"></i>
                        {{ title }}
                    </h5>
                    <button type="button" class="btn-close btn-close-white" @click="cancel"></button>
                </div>
                <div class="modal-body">
                    <p class="mb-0">{{ message }}</p>
                </div>
                <div class="modal-footer confirm-modal-footer">
                    <button type="button" class="btn btn-secondary" @click="cancel">
                        {{ cancelText }}
                    </button>
                    <button type="button" :class="confirmButtonClass" @click="confirm">
                        {{ confirmText }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Modal } from 'bootstrap';

export default {
    name: 'ConfirmModal',
    data() {
        return {
            modal: null,
            title: 'Confirmar',
            message: '',
            confirmText: 'Confirmar',
            cancelText: 'Cancelar',
            type: 'warning', // warning, danger, info
            resolvePromise: null
        }
    },
    computed: {
        iconClass() {
            const icons = {
                warning: 'bi bi-exclamation-triangle-fill text-warning',
                danger: 'bi bi-x-circle-fill text-danger',
                info: 'bi bi-question-circle-fill text-light'
            };
            return icons[this.type] || icons.warning;
        },
        confirmButtonClass() {
            const classes = {
                warning: 'btn btn-warning',
                danger: 'btn btn-danger',
                info: 'btn btn-outline-light'
            };
            return classes[this.type] || 'btn btn-warning';
        }
    },
    mounted() {
        this.modal = new Modal(this.$refs.confirmModal);

        // Handle modal hidden event
        this.$refs.confirmModal.addEventListener('hidden.bs.modal', () => {
            if (this.resolvePromise) {
                this.resolvePromise(false);
                this.resolvePromise = null;
            }
        });
    },
    methods: {
        /**
         * Show confirmation dialog and return promise
         * @param {Object} options - Configuration options
         * @returns {Promise<boolean>} - Resolves true if confirmed, false if cancelled
         */
        async show(options = {}) {
            this.title = options.title || 'Confirmar';
            this.message = options.message || '¿Estás seguro?';
            this.confirmText = options.confirmText || 'Confirmar';
            this.cancelText = options.cancelText || 'Cancelar';
            this.type = options.type || 'warning';

            this.modal.show();

            return new Promise((resolve) => {
                this.resolvePromise = resolve;
            });
        },

        confirm() {
            if (this.resolvePromise) {
                this.resolvePromise(true);
                this.resolvePromise = null;
            }
            this.modal.hide();
        },

        cancel() {
            if (this.resolvePromise) {
                this.resolvePromise(false);
                this.resolvePromise = null;
            }
            this.modal.hide();
        }
    }
}
</script>

<style scoped>
.confirm-modal-content {
    background-color: #1b2838 !important;
    color: #c7d5e0 !important;
    border: 1px solid #2a475e !important;
}

.confirm-modal-header {
    border-bottom: 1px solid #2a475e !important;
}

.confirm-modal-footer {
    border-top: 1px solid #2a475e !important;
}

.confirm-modal-overlay {
    z-index: 2000 !important;
}

/* Asegurar que el backdrop también tenga z-index alto */
:deep(.modal-backdrop) {
    z-index: 1999 !important;
}
</style>
