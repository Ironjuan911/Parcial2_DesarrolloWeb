<template>
    <div v-if="loadingStore.isLoading" class="loading-screen">
        <div class="loading-spinner"></div>
    </div>
</template>

<script>

import { useLoadingStore } from '@/store/loadingStore';

export default {
    name: 'LoadingScreen',
    data() {
        return {
            loadingStore: useLoadingStore(),
        }
    }
}
</script>

<style scoped>
.loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

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