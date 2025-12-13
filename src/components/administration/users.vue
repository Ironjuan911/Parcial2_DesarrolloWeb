<template>

    <defaultModal id="modalId" ref="modal" title="Editar Usuario">
        <template v-slot:default>
            <div v-if="editingUser">
                <div class="mb-3">
                    <label class="form-label">Nombre</label>
                    <input type="text" class="form-control" v-model="editingUser.name">
                </div>
                <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" v-model="editingUser.email">
                </div>
                <div class="mb-3">
                    <label class="form-label">Contraseña</label>
                    <input type="text" class="form-control" v-model="editingUser.password">
                </div>

                <hr>
                <h6>Biblioteca de Juegos</h6>
                <div class="d-flex gap-2 mb-2">
                    <select class="form-select" v-model="selectedGameToAdd">
                        <option value="" disabled selected>Añadir juego a la biblioteca...</option>
                        <option v-for="game in productsWithNames" :key="game.appId" :value="game.appId">{{ game.name }}
                        </option>
                    </select>
                    <button class="btn btn-primary" @click="addGameToUser">Añadir</button>
                </div>
                <ul class="list-group">
                    <li class="list-group-item bg-secondary text-light d-flex justify-content-between align-items-center"
                        v-for="(gameId, gIndex) in editingUser.library" :key="gIndex">
                        {{ getGameName(gameId) }}
                        <button class="btn btn-sm btn-danger" @click="removeGameFromUser(gIndex)">X</button>
                    </li>
                </ul>
            </div>
        </template>


        <template v-slot:footer>
            <button type="button" class="btn btn-secondary" @click="saveUserChanges">Guardar</button>
        </template>
    </defaultModal>

    <alertModal id="alertModal" ref="alertModal" />
    <!-- Pestaña de Usuarios -->
    <div class="tab-pane fade show active" id="users" role="tabpanel" aria-labelledby="users-tab">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h3 class="text-light">Gestión de Usuarios</h3>
        </div>
        <div class="table-responsive">
            <table class="table table-dark table-striped table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Juegos</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(user, index) in users" :key="user.id">
                        <td>{{ user.id }}</td>
                        <td>{{ user.name }}</td>
                        <td>{{ user.email }}</td>
                        <td>{{ user.library ? getSize(user.library) : 0 }}</td>
                        <td>
                            <button class="btn btn-sm btn-primary me-2"
                                @click="openEditUser(user, index)">Editar</button>
                            <button class="btn btn-sm btn-danger" @click="deleteUser(index)">Eliminar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>

import defaultModal from '@/components/modals/defaultModal.vue';
import alertModal from '@/components/modals/alertModal.vue';

import steamDB from '@/services/steamDB.js';

export default {
    name: 'AdminUsers',
    props: ['credentials', 'products', 'storageCredentials'],
    emits: ['userUpdated', 'userDeleted'],
    inject: ['showToast', 'showConfirm'],
    components: {
        defaultModal,
        alertModal
    },
    data() {
        return {
            editingUser: null,
            editingUserIndex: null,
            selectedGameToAdd: null,
            modal: null,
            steamDB: new steamDB(),
            gameNameList: [],
            productsWithNames: []
        }
    },
    watch: {
        products: {
            immediate: true,
            deep: true,
            async handler(newVal) {
                if (newVal && newVal.length > 0) {
                    await this.loadProductNames();
                }
            }
        }
    },
    methods: {
        getSize(library) {
            let size = 0

            const libraryParce = JSON.parse(library)

            for (const game of libraryParce) {
                if (game) {
                    size += 1;
                }
            }


            return size
        },
        async loadProductNames() {
            this.productsWithNames = [];
            for (const product of this.products) {
                try {
                    const appId = product.appId || product.steam_appid || product;
                    if (appId) {
                        const gameData = await this.steamDB.importarJuego(appId);
                        if (gameData) {
                            this.productsWithNames.push({
                                appId: appId,
                                name: gameData.name
                            });
                        }
                    }
                } catch (error) {
                    console.error('Error loading product name:', error);
                }
            }
        },
        openEditUser(user, index) {
            this.editingUser = JSON.parse(JSON.stringify(user));

            if (typeof this.editingUser.library === 'string') {
                try {
                    this.editingUser.library = JSON.parse(this.editingUser.library);
                } catch (e) {
                    console.error("Error parsing user library", e);
                    this.editingUser.library = [];
                }
            }
            if (!Array.isArray(this.editingUser.library)) {
                this.editingUser.library = [];
            }

            this.editingUserIndex = index;

            this.setGameNameList();
            this.$refs.modal.openModal();
        },

        addGameToUser() {
            if (!this.selectedGameToAdd) return;
            if (this.editingUser.library.includes(this.selectedGameToAdd)) {
                this.showToast('warning', 'Advertencia', 'El usuario ya tiene este juego.');
                return;
            }
            this.editingUser.library.push(this.selectedGameToAdd);

            // También agregar a gameNameList para que se muestre inmediatamente
            const gameInfo = this.productsWithNames.find(p => p.appId == this.selectedGameToAdd);
            if (gameInfo && !this.gameNameList.find(g => g.appId == this.selectedGameToAdd)) {
                this.gameNameList.push(gameInfo);
            }

            this.selectedGameToAdd = "";
        },

        removeGameFromUser(index) {
            this.editingUser.library.splice(index, 1);
        },

        async saveUserChanges() {
            try {
                let userToSave = JSON.parse(JSON.stringify(this.editingUser));
                userToSave.library = JSON.stringify(userToSave.library);

                await this.storageCredentials.updateData(this.editingUserIndex, userToSave);

                this.$emit('userUpdated', this.editingUserIndex, userToSave);

                this.$refs.modal.closeModal();
                this.showToast('success', 'Éxito', 'Cambios guardados correctamente.');
            } catch (error) {
                console.error(error);
                this.showToast('error', 'Error', 'Error al guardar los cambios.');
            }
        },

        async setGameNameList() {
            this.gameNameList = [];
            for (const appId of this.editingUser.library) {
                const gameData = await this.steamDB.importarJuego(appId);
                if (gameData) {
                    this.gameNameList.push({ appId: appId, name: gameData.name });
                }
            }
        },


        getGameName(id) {
            return this.gameNameList.find(product => product.appId === id)?.name;

        },

        async deleteUser(index) {
            const confirmed = await this.showConfirm({
                title: 'Eliminar Usuario',
                message: '¿Eliminar este usuario?',
                type: 'danger',
                confirmText: 'Sí, eliminar',
                cancelText: 'Cancelar'
            });

            if (!confirmed) return;

            try {
                await this.storageCredentials.deleteData(index);
                this.$emit('userDeleted', index);
                this.showToast('success', 'Éxito', 'Usuario eliminado correctamente.');
            } catch (error) {
                console.error(error);
                this.showToast('error', 'Error', 'Error al eliminar el usuario.');
            }
        },
    },
    computed: {
        users() {
            return this.credentials
        }
    }

}
</script>

<style scoped></style>