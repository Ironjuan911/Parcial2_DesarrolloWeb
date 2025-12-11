import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
    state: () => ({
        isLoading: false,
        promises: 0
    }),
    actions: {
        setLoading(value) {
            this.isLoading = value;
        },
        loadingPromise() {
            this.promises++;
            this.setLoading(true);
        },
        solvePromise() {
            this.promises--;
            if (this.promises === 0) {
                this.setLoading(false);
            }
        }
    }
})
