<template>
    <div>
        <AppNavbar />
        <div v-for="element in steamGameList" :key=element.id>
            <router-link :to="{ path: '/game', query: { appId: element.steam_appid } }" class="d-block">
                {{ element.name  }} + appId: {{ element.steam_appid }}
            </router-link>


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
        for (const game of this.gameList) {
            try {
                const gameData = await this.steamDB.importarJuego(game.id);
                this.steamGameList.push(gameData);
            } catch (error) {
                console.error(`Error al importar el juego con AppID ${game.id}:`, error);
            }
        }
    }


}
</script>