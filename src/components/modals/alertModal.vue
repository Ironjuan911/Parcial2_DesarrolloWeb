<template>
    <defaultModal :id="id" :title="title" ref="modal" @close="onClose">
        <p>{{ message }}</p>
    </defaultModal>
</template>

<script>
import defaultModal from '@/components/modals/defaultModal.vue';

export default {
    name: 'AlertModal',
    props: ['id'],
    components: {
        defaultModal
    },
    data() {
        return {
            title: '',
            message: '',
            resolvePromise: null
        }
    },
    methods: {
        async alertM(title, message) {
            this.title = title;
            this.message = message;
            this.show();
            return new Promise((resolve) => {
                this.resolvePromise = resolve;
            });
        },
        show() {
            this.$refs.modal.openModal();
        },
        onClose() {
            if (this.resolvePromise) {
                this.resolvePromise();
                this.resolvePromise = null;
            }
        }
    }
}
</script>