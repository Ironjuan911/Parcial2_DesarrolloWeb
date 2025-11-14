<template>
  <div id="app" data-bs-theme="dark" class="--bg-dark">
    <RouterView/>
  </div>
</template>

<script>

import { RouterView } from 'vue-router'
//import LibraryView from './view/Library.vue'

export default {
  name: 'App',
  mounted() {
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
