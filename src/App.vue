<template>
  <div id="app">
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

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
