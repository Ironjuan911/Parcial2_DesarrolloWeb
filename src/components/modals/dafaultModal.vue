<template>
    <!-- Modal -->
    <div class="modal fade" :id="id" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1"
        :aria-labelledby="id + 'Label'" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" :id="id + 'Label'">{{ title }}</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <slot></slot>
                </div>
                <div class="modal-footer">
                    <slot name="footer"></slot>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Modal } from 'bootstrap';

export default {
    name: "defaultModal",
    props: ['title', 'id'],
    data() {
        return {
            modal: null
        }
    },
    mounted() {
        const modalElement = document.getElementById(this.id);
        this.modal = new Modal(modalElement);
        modalElement.addEventListener('hidden.bs.modal', () => {
            this.$emit('close');
        });
    },
    methods: {
        openModal() {
            this.modal.show();
        },
        closeModal() {
            this.modal.hide();
        }
    }
}
</script>

