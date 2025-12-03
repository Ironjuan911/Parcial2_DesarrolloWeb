<template>
  <div id="app" data-bs-theme="dark" class="--bg-dark">
    <RouterView />
  </div>
</template>

<script>

import { RouterView } from 'vue-router'
import storageLE from './services/storageLE';

export default {
  name: 'App',

  data() {
    return {
      storageLE: new storageLE('gameProducts'),

      gameList: [],
      steamGameList: []
    }
  },
  provide() {
    return {
      gameListApp: () => this.gameList,
      steamGameListApp: () => this.steamGameList
    }
  },


  async mounted() {
    this.gameList = [1,2,3,4,5]; // Placeholder inicial
    this.gameList = await this.storageLE.getAll(); //Importamos e almacenamos la lista de juegos en el main, para ahorrar tiempo de carga
    console.log('App mounted.')
  },
  components: {
    //LibraryView,
    RouterView
  }
}

</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: start;
  color: #2c3e50;
  margin-top: 60px;
}

html {
  scroll-padding-top: 12% !important;

}

body {
  margin-top: 7% !important;
}
</style>
