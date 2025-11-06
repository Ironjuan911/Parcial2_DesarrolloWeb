<template>
    <div>
        <AppNavbar />
        <div class="container">
            <div class="row">
                <div v-for="element in steamGameList" :key="element.steam_appid" class = "col-sm-6 col-lg-4 col-xl-3 my-2">
                    <router-link :to="{ path: '/game', query: { appId: element.steam_appid } }"
                        class="card ">
                        <img :src=element.header_image class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">{{ element.name }}</h5>
                            <p class="card-text">{{ element.short_description }}</p>
                        </div>

                    </router-link>
                </div>

            </div>



        </div>
    </div>

</template>

<script>

import AppNavbar from '../components/Navbar.vue'
import gameList from '../data/gameList.json'

import steamDB from '../logic/steamDB.js'

export default {
    name: 'ProductsView',
    components: {
        AppNavbar
    },
    data() {
        return {
            gameList: gameList,
            steamDB: new steamDB(),
            steamGameList: []
        }
    },
    async mounted() {
        // for (const game of this.gameList) {
        //     try {
        //         const gameData = await this.steamDB.importarJuego(game.id);
        //         this.steamGameList.push(gameData);
        //     } catch (error) {
        //         console.error(`Error al importar el juego con AppID ${game.id}:`, error);
        //     }
        // }

        const appIdList = this.gameList.map(game => game.id);
        this.steamGameList = await this.steamDB.processQueue(appIdList, 4); // 4 peticiones simultáneas
    }


}
</script>