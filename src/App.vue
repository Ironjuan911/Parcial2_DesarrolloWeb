<template>
  <div id="app" data-bs-theme="light" class="--bs-body-bg">
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
  text-align: start;
  color: #2c3e50;
  margin-top: 60px;
}

html {
  scroll-padding-top: 12% !important;
  /* background-color: #9ec5fe; */
  
}
body {
  margin-top: 7% !important;
}

/* #app {
  background-color: #9ec5fe;
} */
</style>
