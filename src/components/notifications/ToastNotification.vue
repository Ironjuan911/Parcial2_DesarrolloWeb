<template>
    <!-- Toast Container - positioned in top-right corner -->
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 9999;">
        <div v-for="(toast, index) in toasts" :key="toast.id" class="toast show" :class="getToastClass(toast.type)"
            role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header" :class="getHeaderClass(toast.type)">
                <i :class="getIconClass(toast.type)" class="me-2"></i>
                <strong class="me-auto">{{ toast.title }}</strong>
                <button type="button" class="btn-close btn-close-white" @click="removeToast(index)"></button>
            </div>
            <div class="toast-body">
                {{ toast.message }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ToastNotification',
    data() {
        return {
            toasts: [],
            toastId: 0
        }
    },
    methods: {
        /**
         * Mostrar un toast de éxito
         */
        success(title, message, duration = 4000) {
            this.addToast('success', title, message, duration);
        },

        /**
         * Mostrar un toast de error
         */
        error(title, message, duration = 5000) {
            this.addToast('error', title, message, duration);
        },

        /**
         * Mostrar un toast de información
         */
        info(title, message, duration = 4000) {
            this.addToast('info', title, message, duration);
        },

        /**
         * Mostrar un toast de advertencia
         */
        warning(title, message, duration = 4500) {
            this.addToast('warning', title, message, duration);
        },

        /**
         * Agregar toast a la lista
         */
        addToast(type, title, message, duration) {
            const id = this.toastId++;
            this.toasts.push({ id, type, title, message });

            // Auto-remove after duration
            setTimeout(() => {
                this.removeToastById(id);
            }, duration);
        },

        /**
         * Eliminar toast por índice
         */
        removeToast(index) {
            this.toasts.splice(index, 1);
        },

        /**
         * Eliminar toast por ID
         */
        removeToastById(id) {
            const index = this.toasts.findIndex(t => t.id === id);
            if (index !== -1) {
                this.toasts.splice(index, 1);
            }
        },

        /**
         * Obtener clase CSS del toast según tipo
         */
        getToastClass(type) {
            const classes = {
                success: 'bg-success text-white',
                error: 'bg-danger text-white',
                info: 'bg-info text-white',
                warning: 'bg-warning text-dark'
            };
            return classes[type] || 'bg-secondary text-white';
        },

        /**
         * Obtener clase del header según tipo
         */
        getHeaderClass(type) {
            const classes = {
                success: 'bg-success text-white border-0',
                error: 'bg-danger text-white border-0',
                info: 'bg-info text-white border-0',
                warning: 'bg-warning text-dark border-0'
            };
            return classes[type] || 'bg-secondary text-white border-0';
        },

        /**
         * Obtener ícono según tipo
         */
        getIconClass(type) {
            const icons = {
                success: 'bi bi-check-circle-fill',
                error: 'bi bi-x-circle-fill',
                info: 'bi bi-info-circle-fill',
                warning: 'bi bi-exclamation-triangle-fill'
            };
            return icons[type] || 'bi bi-bell-fill';
        }
    }
}
</script>

<style scoped>
.toast {
    min-width: 300px;
    margin-bottom: 0.5rem;
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }

    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.toast-header {
    border-bottom: none;
}

.btn-close-white {
    filter: brightness(0) invert(1);
}

.bg-warning .btn-close-white {
    filter: none;
}
</style>
