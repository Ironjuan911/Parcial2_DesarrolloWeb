import { defineStore } from 'pinia'
import storageLE from '@/services/storageLE'

export const useAdminStore = defineStore('admin', {
    state: () => ({
        isAdmin: false,
        checkStatus: false,
        storageLE: new storageLE('adminID'),
        _checkPromise: null // Promesa en curso para evitar llamadas duplicadas
    }),
    actions: {
        async checkAdminStatus() {
            // 1. Si ya está verificado, devolvemos el valor caché
            if (this.checkStatus) {
                console.log('Admin status checked (cached).');
                return this.isAdmin;
            }

            // 2. Si ya hay una verificación EN CURSO, devolvemos esa misma promesa
            if (this._checkPromise) {
                console.log('Admin status check already in progress... waiting.');
                return this._checkPromise;
            }

            // 3. Si no, iniciamos una nueva y guardamos la promesa
            this._checkPromise = this.setAdminStatus().finally(() => {
                this._checkPromise = null; // Limpiamos la promesa al terminar
            });

            return this._checkPromise;
        },

        async setAdminStatus() {
            this.checkStatus = false;
            console.log('Checking admin status from DB...');

            if (!JSON.parse(localStorage.getItem('user'))) {
                return false;
            }

            const administrators = await this.storageLE.getAll();
            const user = JSON.parse(localStorage.getItem('user'));

            this.isAdmin = false; // Reset por defecto

            if (user && administrators) {
                for (const admin of administrators) {
                    if (admin.id === user.id) {
                        this.isAdmin = true;
                        break;
                    }
                }
            }

            this.checkStatus = true;
            return this.isAdmin;
        }
    }
})
