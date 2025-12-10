<template>
    <div>
        <AppNavbar />
        <LoadingScreen />

        <div class="container mt-4" v-if="isAdmin">
            <h1 class="text-light mb-4">Panel de Administración</h1>

            <!-- Navegación de Pestañas -->
            <ul class="nav nav-tabs mb-4" id="adminTabs" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="users-tab" data-bs-toggle="tab" data-bs-target="#users"
                        type="button" role="tab" aria-controls="users" aria-selected="true">Usuarios</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="products-tab" data-bs-toggle="tab" data-bs-target="#products"
                        type="button" role="tab" aria-controls="products" aria-selected="false">Productos</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="admins-tab" data-bs-toggle="tab" data-bs-target="#admins" type="button"
                        role="tab" aria-controls="admins" aria-selected="false">Administradores</button>
                </li>
            </ul>

            <!-- Contenido de las Pestañas -->
            <div class="tab-content" id="adminTabsContent">

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
                                    <td>{{ user.library ? user.library.length : 0 }}</td>
                                    <td>
                                        <button class="btn btn-sm btn-primary me-2"
                                            @click="openEditUser(user, index)">Editar</button>
                                        <button class="btn btn-sm btn-danger"
                                            @click="deleteUser(index)">Eliminar</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Pestaña de Productos -->
                <div class="tab-pane fade" id="products" role="tabpanel" aria-labelledby="products-tab">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h3 class="text-light">Catálogo de Juegos</h3>
                        <button class="btn btn-success" @click="openAddProduct">Nuevo Juego (SteamDB)</button>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-dark table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>AppID</th>
                                    <th>Nombre</th>
                                    <th>Precio</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(product, index) in productsSteamDB" :key="product.steam_appid">
                                    <td>{{ product.steam_appid }}</td>
                                    <td>{{ product.name }}</td>
                                    <td>{{ product.is_free ? 'Free to Play' : (product.price_overview?.final_formatted)
                                    }}</td>
                                    <td>
                                        <button class="btn btn-sm btn-danger"
                                            @click="deleteProduct(index)">Eliminar</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Pestaña de Administradores -->
                <div class="tab-pane fade" id="admins" role="tabpanel" aria-labelledby="admins-tab">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h3 class="text-light">Administradores del Sistema</h3>
                        <div class="d-flex gap-2">
                            <select class="form-select" v-model="selectedUserIdToAdd">
                                <option value="" disabled selected>Seleccionar usuario...</option>
                                <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }} ({{
                                    user.id }})</option>
                            </select>
                            <button class="btn btn-success text-nowrap" @click="addAdmin">Añadir Admin</button>
                        </div>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-dark table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>ID Admin</th>
                                    <th>Nombre (Referencia)</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(admin, index) in admins" :key="admin.id">
                                    <td>{{ admin.id }}</td>
                                    <td>{{ getUserName(admin.id) }}</td>
                                    <td>
                                        <button class="btn btn-sm btn-danger"
                                            @click="removeAdmin(index)">Revocar</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>

        <!-- Modal Editar Usuario -->
        <div class="modal fade" id="editUserModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content bg-dark text-light">
                    <div class="modal-header">
                        <h5 class="modal-title">Editar Usuario</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body" v-if="editingUser">
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
                                <option v-for="game in products" :key="game.appId || game.id"
                                    :value="game.appId || game.id">{{ game.name }}
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
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" @click="saveUserChanges">Guardar Cambios</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Nuevo Producto (SteamDB) -->
        <div class="modal fade" id="addProductModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content bg-dark text-light">
                    <div class="modal-header">
                        <h5 class="modal-title">Añadir Producto desde Steam</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                            aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="input-group mb-3">
                            <input type="text" class="form-control" placeholder="Steam AppID (ej: 440)"
                                v-model="searchAppId" @keyup.enter="searchGame">
                            <button class="btn btn-primary" type="button" @click="searchGame">Buscar</button>
                        </div>

                        <div v-if="loadingPreview" class="text-center my-3">
                            <div class="spinner-border text-light" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>

                        <!-- Previsualización (Card Style) -->
                        <div v-if="previewGame" class="card productCard bg-info text-decoration-none mx-auto"
                            data-bs-theme="dark" style="max-width: 300px;">
                            <img :src="previewGame.header_image" class="card-img-top" alt="...">
                            <div class="card-body">
                                <h5 class="card-title">{{ previewGame.name }}</h5>
                                <div class="card bg-secondary px-1 d-inline-block">
                                    <p class="card-text">
                                        {{ previewGame.is_free ? 'Free to Play' :
                                            (previewGame.price_overview?.final_formatted || 'N/A') }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div v-if="previewGame" class="mt-3">
                            <label class="form-label">Descripción Corta</label>
                            <textarea class="form-control" rows="3" disabled
                                :value="previewGame.short_description"></textarea>
                        </div>

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-success" @click="saveNewProduct" :disabled="!previewGame">
                            Añadir al Catálogo
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import storageLE from '@/services/storageLE';
import AppNavbar from '../components/Navbar.vue'
import { useAdminStore } from '@/store/adminStore';
import steamDB from '@/logic/steamDB'; // Importamos la lógica de Steam
import { Modal } from 'bootstrap';
import LoadingScreen from '../components/loadingComponents/loadingScreen.vue';

export default {
    name: 'AdminView',
    components: {
        AppNavbar,
        LoadingScreen
    },
    data() {
        return {
            isAdmin: false,

            // Servicios
            storageCredentials: new storageLE('credentials'),
            storageProducts: new storageLE('gameProducts'),
            storageAdmins: new storageLE('adminID'),
            steamDB: new steamDB(),

            // Datos
            users: [],
            products: [],
            admins: [],

            productsSteamDB: [],

            // Edición Usuario
            editingUser: null,
            editingUserIndex: -1,
            editUserModalInstance: null,
            selectedGameToAdd: "",

            // Nuevo Producto (SteamDB)
            searchAppId: '',
            previewGame: null,
            loadingPreview: false,
            addProductModalInstance: null,

            // Admins
            selectedUserIdToAdd: ""
        };
    },
    async mounted() {
        const adminStore = useAdminStore();
        this.isAdmin = await adminStore.checkAdminStatus();

        if (!this.isAdmin) {
            this.$router.push({ path: '/' });
            alert('Access denied. Admins only.');
            return;
        }

        await this.loadAllData();

        this.editUserModalInstance = new Modal(document.getElementById('editUserModal'));
        this.addProductModalInstance = new Modal(document.getElementById('addProductModal'));
    },

    methods: {
        async loadAllData() {
            try {
                const [usersData, productsData, adminsData] = await Promise.all([
                    this.storageCredentials.getAll(),
                    this.storageProducts.getAll(),
                    this.storageAdmins.getAll()
                ]);

                this.users = usersData.map(user => {
                    if (user.library && typeof user.library === 'string') {
                        try {
                            user.library = JSON.parse(user.library);
                        } catch (e) {
                            user.library = [];
                        }
                    } 
                    return user;
                });
                this.products = productsData;

                await this.updateProductsSteamDB();

                this.admins = adminsData;
            } catch (error) {
                console.error("Error loading data:", error);
            }
        },

        async updateProductsSteamDB() {
            const promises = this.products.map(product =>
                this.steamDB.importarJuego(product.appId || product.id)
            );
            const results = await Promise.all(promises);
            this.productsSteamDB = results.filter(game => game !== null);
        },

        // --- Helpers ---
        getUserName(userId) {
            const user = this.users.find(u => u.id === userId);
            return user ? user.name : 'Usuario Desconocido';
        },
        getGameName(gameId) {
            // Buscamos por appId o id
            const game = this.products.find(p => (p.appId == gameId) || (p.id == gameId));
            return game ? game.name : `Juego ID: ${gameId}`;
        },

        // --- Gestión de Usuarios ---
        openEditUser(user, index) {
            this.editingUser = JSON.parse(JSON.stringify(user));

            if (!this.editingUser.library) {
                this.editingUser.library = [];
            }
            this.editingUserIndex = index;
            this.editUserModalInstance.show();
        },

        addGameToUser() {
            if (!this.selectedGameToAdd) return;
            if (this.editingUser.library.includes(this.selectedGameToAdd)) {
                alert("El usuario ya tiene este juego.");
                return;
            }
            this.editingUser.library.push(this.selectedGameToAdd);
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

                this.users[this.editingUserIndex] = JSON.parse(JSON.stringify(this.editingUser));
                this.editUserModalInstance.hide();
                alert("Usuario actualizado.");
            } catch (error) {
                console.error(error);
                alert("Error al guardar.");
            }
        },

        async deleteUser(index) {
            if (!confirm("¿Eliminar usuario?")) return;
            try {
                await this.storageCredentials.deleteData(index);
                this.users.splice(index, 1);
            } catch (error) {
                console.error(error);
                alert("Error al eliminar.");
            }
        },

        // --- Gestión de Productos (SteamDB) ---
        openAddProduct() {
            this.searchAppId = '';
            this.previewGame = null;
            this.addProductModalInstance.show();
        },

        async searchGame() {
            if (!this.searchAppId) return;
            this.loadingPreview = true;
            this.previewGame = null;
            try {
                const data = await this.steamDB.importarJuego(this.searchAppId);
                if (data) {
                    this.previewGame = data;
                } else {
                    alert("Juego no encontrado o error en API.");
                }
            } catch (error) {
                console.error(error);
                alert("Error al buscar el juego.");
            } finally {
                this.loadingPreview = false;
            }
        },

        async saveNewProduct() {
            if (!this.previewGame) return;

            // Construimos el objeto a guardar.
            // Guardamos appId y también datos básicos para que la tabla de admin se vea bonita sin recargar todo.
            const newGame = {
                appId: this.previewGame.steam_appid,
                name: this.previewGame.name,
                price: this.previewGame.price_overview ? this.previewGame.price_overview.final / 100 : 0, // Aprox
                img: this.previewGame.header_image,
                description: this.previewGame.short_description
            };

            try {
                await this.storageProducts.createData(newGame);
                this.products.push(newGame);
                this.addProductModalInstance.hide();
                alert("Producto añadido al catálogo.");
            } catch (error) {
                console.error(error);
                alert("Error al guardar producto.");
            }
        },

        async deleteProduct(index) {
            if (!confirm("¿Eliminar producto del catálogo?")) return;
            try {
                await this.storageProducts.deleteData(index);
                this.products.splice(index, 1);
            } catch (error) {
                console.error(error);
                alert("Error al eliminar.");
            }
        },

        // --- Gestión de Admins ---
        async addAdmin() {
            if (!this.selectedUserIdToAdd) return;
            if (this.admins.some(a => a.id === this.selectedUserIdToAdd)) {
                alert("Ya es admin.");
                return;
            }
            try {
                const newAdmin = { id: this.selectedUserIdToAdd };
                await this.storageAdmins.createData(newAdmin);
                this.admins.push(newAdmin);
                this.selectedUserIdToAdd = "";
                alert("Admin añadido.");
            } catch (error) {
                console.error(error);
                alert("Error al añadir admin.");
            }
        },

        async removeAdmin(index) {
            if (!confirm("¿Revocar admin?")) return;
            try {
                await this.storageAdmins.deleteData(index);
                this.admins.splice(index, 1);
            } catch (error) {
                console.error(error);
                alert("Error al revocar.");
            }
        }
    },
};
</script>

<style>
.nav-tabs .nav-link {
    color: #ccc;
}

.nav-tabs .nav-link.active {
    background-color: #212529;
    color: #fff;
    border-color: #dee2e6 #dee2e6 #212529;
}

.productCard {
    box-shadow: 0px 0px 10px 3px rgba(0, 0, 0, 0.3);
}
</style>