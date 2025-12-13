<template>

    <alertModal id="alertModal" ref="alertModal" />
    <defaultModal :title="'Agregar Juego'" id="gamesModal" ref="defaultModal">
        <template v-slot:default>
            <div class="input-group mb-3">
                <input type="text" class="form-control" placeholder="Steam AppID (ej: 440)" v-model="searchAppId"
                    @keyup.enter="searchGame">
                <button class="btn btn-primary" type="button" @click="searchGame">Buscar</button>
            </div>

            <div v-if="loadingPreview" class="text-center my-3">
                <div class="spinner-border text-light" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>

            <!-- Previsualización (Card Style) -->
            <div v-if="previewGame" class="d-flex justify-content-center">
                <productCard :gameData="previewGame" :isLink="false" style="max-width: 300px;" />
            </div>

            <div v-if="previewGame" class="mt-3">
                <label class="form-label">Descripción Corta</label>
                <textarea class="form-control" rows="3" disabled :value="previewGame.short_description"></textarea>
            </div>

        </template>

        <template v-slot:footer>
            <button type="button" class="btn btn-success" @click="saveNewProduct" :disabled="!previewGame">
                Añadir al Catálogo
            </button>
        </template>

    </defaultModal>


    <div>
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
                    <tr v-for="(product, index) in steamGameList" :key="product.steam_appid">
                        <td>{{ product.steam_appid }}</td>
                        <td>{{ product.name }}</td>
                        <td>{{ product.is_free ? 'Free to Play' : (product.price_overview?.final_formatted)
                        }}</td>
                        <td>
                            <button class="btn btn-sm btn-danger" @click="deleteProduct(index)">Eliminar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import defaultModal from '../modals/defaultModal.vue';
import alertModal from '../modals/alertModal.vue';
import productCard from '@/components/gameCards/product.vue';
import steamDB from '@/services/steamDB.js';

export default {
    name: 'AdminGames',
    props: ['gameProducts', 'storageProducts'],
    emits: ['productAdded', 'productDeleted'],
    components: {
        defaultModal,
        alertModal,
        productCard
    },
    data() {
        return {
            searchAppId: '',
            previewGame: null,
            loadingPreview: false,
            steamDB: new steamDB(),

            steamGameList: []
        };
    },
    watch: {
        gameProducts: {
            immediate: true,
            deep: true,
            handler(newVal, oldVal) {
                console.log("Watch disparado! newVal length:", newVal?.length, "oldVal length:", oldVal?.length);
                if (newVal && newVal.length > 0) {
                    console.log("Llamando UpdateSteamGameList...");
                    this.UpdateSteamGameList();
                }
            }
        }
    },
    methods: {
        async UpdateSteamGameList() {
            console.log("UpdateSteamGameList ejecutándose, gameProducts:", this.gameProducts.length);
            this.steamGameList = [];
            if (!this.gameProducts || this.gameProducts.length === 0) {
                return;
            }

            // Fetch game details for each appId
            for (const game of this.gameProducts) {
                try {
                    // gameProducts might have different structures: {appId: "123"} or {steam_appid: 123} or just "123"
                    const appId = game.appId || game.steam_appid || game;
                    if (appId) {
                        const gameData = await this.steamDB.importarJuego(appId);
                        if (gameData) {
                            this.steamGameList.push(gameData);
                        }
                    }
                } catch (error) {
                    console.error(`Error loading game:`, error);
                }
            }
        },
        openAddProduct() {
            this.searchAppId = '';
            this.previewGame = null;
            this.$refs.defaultModal.openModal();
        },
        async searchGame() {
            if (!this.searchAppId) return;
            this.loadingPreview = true;
            this.previewGame = null;

            try {
                const gameData = await this.steamDB.importarJuego(this.searchAppId);
                if (gameData) {
                    this.previewGame = gameData;
                } else {
                    this.$refs.alertModal.alertM("No encontrado", "No se encontró juego con ese ID.");
                }
            } catch (error) {
                console.error(error);
                this.$refs.alertModal.alertM("Error", "Error al buscar el juego.");
            } finally {
                this.loadingPreview = false;
            }
        },
        async saveNewProduct() {
            if (!this.previewGame) return;
            try {
                // Solo guardamos el appId en la base de datos
                // La información completa se carga dinámicamente desde Steam
                const productToSave = {
                    appId: this.previewGame.steam_appid
                };

                await this.storageProducts.createData(productToSave);
                console.log("Producto guardado, emitiendo evento:", productToSave);
                this.$emit('productAdded', productToSave);

                this.$refs.defaultModal.closeModal();

                // No alert modal - la tabla se actualizará automáticamente
            } catch (error) {
                console.error("Error al guardar producto:", error);
                this.$refs.alertModal.alertM("Error", "Error al guardar el juego: " + error.message);
            }
        },
        async deleteProduct(index) {
            if (!confirm("¿Eliminar este juego del catálogo?")) return;
            try {
                await this.storageProducts.deleteData(index);
                this.$emit('productDeleted', index);
                // El watch de gameProducts actualizará automáticamente steamGameList
            } catch (error) {
                console.error(error);
                this.$refs.alertModal.alertM("Error", "Error al eliminar el juego.");
            }
        }
    }
}
</script>

<style scoped></style>
