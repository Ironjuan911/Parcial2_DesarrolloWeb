<template>
    <div v-show="isActive" class="tab-pane fade show active" role="tabpanel" tabindex="0">
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'TabItem',
    props: {
        title: {
            type: String,
            required: true
        }
    },
    inject: ['registerTab'],
    data() {
        return {
            isActive: false
        }
    },
    mounted() {
        this.registerTab(this);
    }
}
</script>
