<template>
    <span v-if="loadingStore.isLoading">
        <!-- <div class="loading-spinner"></div> -->
        <span class="spinner-border spinner-border-sm" aria-hidden="true"></span>
    </span>
</template>

<script>

import { useLoadingStore } from '@/store/loadingStore';

export default {
    name: 'LoadingIcon',
    data() {
        return {
            loadingStore: useLoadingStore(),
        }
    }
}
</script>

<style scoped>
.loading-spinner {
    width: 50px;
    height: 50px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>