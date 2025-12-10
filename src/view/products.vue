<template>
    <div>
        <AppNavbar />
        <LoadingScreen />
        <div class="container">
            <div class="row">
                <div v-for="element in steamGameList" :key="element.steam_appid"
                    class="col-sm-6 col-lg-4 col-xl-3 my-2">
                    <router-link :to="{ path: '/game', query: { appId: element.steam_appid } }"
                        class="card productCard bg-info text-decoration-none" data-bs-theme="dark">
                        <img :src=element.header_image class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">{{ element.name }}</h5>
                            <div class="card bg-secondary px-1 d-inline-block">
                                <p class="card-text">{{ element.is_free ? 'Free to Play' :
                                    (element.price_overview?.final_formatted) }}</p>
                            </div>

                        </div>

                    </router-link>
                </div>
                <div v-for="n in gameLeft" :key="n" class="col-sm-6 col-lg-4 col-xl-3 my-2" aria-hidden="true">
                    <div class="card productCard bg-info text-decoration-none h-100" data-bs-theme="dark">
                        <div class="card-img-top bg-secondary placeholder-glow"
                            style="aspect-ratio:2.13/1; width:100%; border-radius:0.375rem;">
                        </div>
                        <div class="card-body">
                            <div>
                                <span class=" placeholder-glow col-6"></span>
                            </div>

                            <div class="card bg-secondary px-1 d-inline-block">
                                <span class="card-text placeholder-glow placeholder col-3" style="width:15px"></span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>



        </div>
    </div>

</template>

<script>

import AppNavbar from '../components/Navbar.vue'

import steamDB from '../logic/steamDB.js'
import storageLE from '@/services/storageLE'

import LoadingScreen from '../components/loadingComponents/loadingScreen.vue'

export default {
    name: 'ProductsView',
    inject: ['gameListApp', 'steamGameListApp'],
    components: {
        AppNavbar,
        LoadingScreen
    },
    data() {
        return {
            steamDB: new steamDB(),
            storageLE: new storageLE('gameProducts'),

            gameList: [], //Lista de juegos a importar
            gameLeft: [], //Lista de juegos restantes por cargar
            steamGameList: [] //Lista de juegos importados desde steamDB

        }
    },
    async mounted() {
        this.gameLeft = [1, 2, 3, 4, 5] // gameLeft es un placeholder, mostramos fantasmas de los productos anteriores

        this.steamGameListRef = this.steamGameListApp //Cargamos la lista de juegos importados, los cuales son desactualizados, pero se mostraran mientras los actualizamos


        this.gameList = await this.storageLE.getAll(); //Cargamos los juegos a importar

        this.steamGameList = []; //Reseteamos la lista de juegos importados, pues ya tenemos los appId refrescados

        await this.updateProducts();



        // const appIdList = this.gameList.map(game => game.id);
        // this.steamGameList = await this.steamDB.processQueue(appIdList, 4); // 4 peticiones simultáneas
    },
    methods: {
        async updateProducts() {
            this.gameLeft = [];
            this.gameLeft = [...this.gameList];
            for (const game of this.gameList) {
                const appId = game.appId;
                try {
                    const gameData = await this.steamDB.importarJuego(appId);
                    if (gameData) {
                        this.steamGameList.push(gameData);
                    }
                } catch (error) {
                    console.error(`Error al importar el juego con AppID ${appId}:`, error);
                } finally {
                    this.gameLeft.pop();
                }
            }
            this.steamGameListRef.value = this.steamGameList; // Actualizamos la referencia inyectada
        }
    }


}
</script>

<style>
.productCard {
    box-shadow: 0px 0px 10px 3px rgba(0, 0, 0, 0.3);
}
</style>