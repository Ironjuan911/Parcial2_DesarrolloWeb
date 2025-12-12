<template>
    <defaultModal :id="id" ref="modal" @close="onClose">
        <template v-slot:title>
            {{ title }}
        </template>

        <p>{{ message }}</p>
    </defaultModal>
</template>

<script>
import defaultModal from '@/components/modals/dafaultModal.vue';

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