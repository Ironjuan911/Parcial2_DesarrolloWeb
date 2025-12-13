<template>
    <div>
        <AppNavbar />
        <div class="container">
            <div class="row" data-bs-theme="dark">
                <h2 class="my-4 text-light">Mi Biblioteca</h2>
                <div v-for="item in libraryList" :key="item.appId" class="col-6 col-md-4 col-lg-3 col-xl-2 my-2">
                    <libraryCard :gameData="item" @refund="handleRefund" />
                </div>

                <div v-for="item in libraryLeft" :key="item.appId" class="col-6 col-md-4 col-lg-3 col-xl-2 my-2"
                    aria-hidden="true">
                    <libraryCard :gameData="undefined" />
                </div>
            </div>

        </div>


    </div>

</template>

<script>

import AppNavbar from '../components/navs/Navbar.vue'
import libraryCard from '../components/gameCards/library.vue'
import steamDB from '../services/steamDB.js'
import StorageLE from '../services/storageLE.js'

export default {
    name: 'LibraryView',
    components: {
        AppNavbar,
        libraryCard
    }, data() {
        return {
            steamDB: new steamDB(),
            storageCredentials: new StorageLE('credentials'),
            userIndex: null,
            libraryId: [],
            libraryLeft: [],
            libraryList: []
        }
    },
    async mounted() {
        const localUser = JSON.parse(localStorage.getItem('user'));

        // 1. Mostrar primero desde localStorage (carga rápida)
        this.libraryId = localUser.library || '[]';
        try {
            this.libraryId = JSON.parse(this.libraryId);
        } catch (e) {
            this.libraryId = [];
        }

        this.libraryLeft = [...this.libraryId];

        // Cargar imágenes de biblioteca desde Steam (visualización inicial)
        for (const id of this.libraryId) {
            let libraryData = await this.steamDB.importLibrary(id);
            this.libraryList.push(libraryData);
            this.libraryLeft.pop();
        }

        // 2. Sincronizar con Google Sheets y actualizar localStorage
        try {
            const allUsers = await this.storageCredentials.getAll();
            const foundIndex = allUsers.findIndex(u => String(u.id) === String(localUser.id));

            if (foundIndex !== -1) {
                this.userIndex = foundIndex;
                const serverUser = allUsers[foundIndex];
                console.log('Usuario encontrado en índice:', this.userIndex);

                // Parsear la biblioteca del servidor
                let serverLibrary = serverUser.library || '[]';
                try {
                    serverLibrary = JSON.parse(serverLibrary);
                } catch (e) {
                    serverLibrary = [];
                }

                // Comparar y sincronizar si hay diferencias
                const localLibraryStr = JSON.stringify(this.libraryId);
                const serverLibraryStr = JSON.stringify(serverLibrary);

                if (localLibraryStr !== serverLibraryStr) {
                    console.log('Sincronizando biblioteca con datos del servidor...');

                    // Actualizar con los datos del servidor
                    this.libraryId = serverLibrary;

                    // Actualizar localStorage con datos del servidor
                    localUser.library = JSON.stringify(serverLibrary);
                    localStorage.setItem('user', JSON.stringify(localUser));

                    // Recargar las imágenes si hay cambios
                    this.libraryList = [];
                    this.libraryLeft = [...this.libraryId];

                    for (const id of this.libraryId) {
                        let libraryData = await this.steamDB.importLibrary(id);
                        this.libraryList.push(libraryData);
                        this.libraryLeft.pop();
                    }

                    console.log('Biblioteca sincronizada correctamente');
                }
            } else {
                console.warn('Usuario no encontrado en la base de datos');
            }
        } catch (error) {
            console.error('Error sincronizando con Google Sheets:', error);
        }

        console.log('Biblioteca cargada:', this.libraryList);
    },
    methods: {
        async handleRefund(appId) {
            // Eliminar del array de IDs
            const index = this.libraryId.indexOf(appId);
            if (index > -1) {
                this.libraryId.splice(index, 1);
            }

            // Eliminar de la lista visual
            const listIndex = this.libraryList.findIndex(item => item.appId == appId);
            if (listIndex > -1) {
                this.libraryList.splice(listIndex, 1);
            }

            // Actualizar localStorage
            const user = JSON.parse(localStorage.getItem('user'));
            user.library = JSON.stringify(this.libraryId);
            localStorage.setItem('user', JSON.stringify(user));

            // Actualizar en Google Sheets
            try {
                if (this.userIndex !== null && this.userIndex !== undefined) {
                    await this.storageCredentials.updateData(this.userIndex, user);
                    console.log('Biblioteca actualizada en Google Sheets');
                }
            } catch (error) {
                console.error('Error actualizando en Google Sheets:', error);
            }

            alert("Juego reembolsado exitosamente. El juego ha sido removido de tu biblioteca.");
        }
    }
}
</script>
