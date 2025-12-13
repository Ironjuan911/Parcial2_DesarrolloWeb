<template>
  <div id="app" data-bs-theme="dark" class="--bg-dark">
    <ToastNotification ref="toast" />
    <ConfirmModal ref="confirmModal" />
    <RouterView />
  </div>
</template>

<script>

import { RouterView } from 'vue-router'
import { ref } from 'vue';
import storageLE from './services/storageLE';
import ToastNotification from './components/notifications/ToastNotification.vue';
import ConfirmModal from './components/modals/ConfirmModal.vue';

import { useAdminStore } from '@/store/adminStore';

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
      gameListApp: ref(this.gameList),
      steamGameListApp: ref(this.steamGameList),
      showToast: (type, title, message) => {
        if (this.$refs.toast) {
          this.$refs.toast[type](title, message);
        }
      },
      showConfirm: async (options) => {
        if (this.$refs.confirmModal) {
          return await this.$refs.confirmModal.show(options);
        }
        return false;
      }
    }
  },


  async mounted() {
    const adminStore = useAdminStore();
    console.log("Admin status: " + await adminStore.checkAdminStatus());

    this.gameList = await this.storageLE.getAll(); //Importamos e almacenamos la lista de juegos en el main, para ahorrar tiempo de carga
    console.log('App mounted.')
  },
  components: {
    ToastNotification,
    ConfirmModal,
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
