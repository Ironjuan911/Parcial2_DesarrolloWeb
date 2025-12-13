<template>
    <div>
        <AppNavbar />
        <LoadingScreen />
        <div class="container">
            <div class="row">
                <div v-for="element in steamGameList" :key="element.steam_appid"
                    class="col-sm-6 col-lg-4 col-xl-3 my-2">
                    <ProductCard :gameData="element" />
                </div>
                <div v-for="n in gameLeft" :key="n" class="col-sm-6 col-lg-4 col-xl-3 my-2" aria-hidden="true">
                    <ProductCard :gameData="undefined" />
                </div>

            </div>

        </div>
    </div>

</template>

<script>

import AppNavbar from '../components/navs/Navbar.vue'
import ProductCard from '../components/gameCards/product.vue'

import steamDB from '../services/steamDB.js'
import storageLE from '@/services/storageLE'

import LoadingScreen from '../components/loadingComponents/loadingScreen.vue'

export default {
    name: 'ProductsView',
    inject: ['gameListApp', 'steamGameListApp'],
    components: {
        AppNavbar,
        LoadingScreen,
        ProductCard
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
