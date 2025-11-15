<template>

  <nav class="navbar navbar-expand-lg" style="background-color: #0c0c0c;" data-bs-theme="dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        <img src="../assets/logo.png" class="me-1" alt="" width="30" height="30" />
        SteamLE
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon">

        </span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav  me-auto mb-2 mb-lg-0">


          <li v-for="(element, index) in navElements" :key="index" class="nav-item">
            <router-link class="nav-link" :to="element.href">{{ element.text }}</router-link>
          </li>


          <li class="nav-item dropdown">
            <button class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Ajustes
            </button>
            <ul class="dropdown-menu">
              <li v-if="isLoggedIn"><button @click="closeSession" class="dropdown-item">Cerrar la sesión actual</button>
              </li>
              <li><button @click="setDefaultCredentials" class="dropdown-item">Reestablecer a las credenciales por
                  defecto</button></li>

              <li v-if="isLoggedIn">
                <hr class="dropdown-divider">
              </li>

              <li class="dropdown-item" v-if="isLoggedIn">
                <div class="mb-2">Clave de activación:</div>
                <form class="d-flex " role="search" @submit.prevent="keygame">
                  <input class="form-control me-2" type="search" placeholder="AppId" aria-label="Search" required
                    v-model="buyAppId" />
                  <button class="btn btn-primary" type="submit">Search</button>
                </form>

              </li>

            </ul>
          </li>


          <!-- <li class="nav-item">
          <a class="nav-link disabled" aria-disabled="true">Disabled</a>
        </li> -->


          <!-- Separacion del navbar -->
          <div class="me-auto"></div>


        </ul>

        <ul class="navbar-nav mb-2 mb-lg-0">
          <template v-if="!isLoggedIn">
            <li v-for="element in loginElements" :key="element.href" :class="'nav-item'">
              <a class="nav-link" :href="element.href">{{ element.text }}</a>
            </li>

          </template>
          <template v-if="isLoggedIn">
            <div class="card bg-info nav-item d-flex justify-content-center px-2 py-1 me-1 ">
              <div class="d-flex justify-content-center">
                hola, {{ user.name }}
              </div>


            </div>

          </template>
        </ul>


      </div>
    </div>
  </nav>

</template>

<script>
import dataManager from '@/logic/dataManager';
import steamDB from '@/logic/steamDB';

export default {
  name: 'AppNavbar',
  data() {
    return {
      dataManager: new dataManager(),
      steamDB: new steamDB(),

      firstElements: [
        { text: 'Inicio', href: '/' },
        { text: 'Productos', href: '/products' },
      ],
      sesionElements: [
        { text: 'Biblioteca', href: '/library' },
      ],

      lastElements: [
        //{ text: 'Acerca de', href: '/about' },
      ],
      navElements: [],

      loginElements: [
        { text: 'Iniciar Sesión', href: '/login' },
        { text: 'Registrarse', href: '/registration' },
      ],

      isLoggedIn: false,
      buyAppId: '',
      user: null,


    }
  },
  mounted() {
    this.navElements = [...this.firstElements];
    if (localStorage.getItem('usuarioLogueado')) {
      this.navElements.push(...this.sesionElements);
      this.isLoggedIn = true;
      this.user = JSON.parse(localStorage.getItem('usuarioLogueado'));
    }
    this.navElements.push(...this.lastElements);
  },
  methods: {
    closeSession() {
      this.dataManager.closeSession();
      this.isLoggedIn = false;
      this.$router.push({ path: '/' });// Redirect to home after login
    },
    setDefaultCredentials() {
      this.dataManager.setDefaultCredentials();
      this.closeSession();
    },
    async keygame() {
      if (this.buyAppId.trim() === '') {
        alert("Por favor, ingrese un AppId válido.");
        return;
      }
      try {
        const game = await this.steamDB.importarJuego(this.buyAppId);
        if (game != null) {
          //return;
          this.$router.push({ path: '/game', query: { appId: this.buyAppId } });
        } else {
          alert("AppId inválido.");
        }
      } catch (error) {
        alert("AppId inválido.");
        return;
      } finally {
        this.buyAppId = '';
      }


    }
  }
}

</script>

<style>
nav {
  position: fixed !important;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 9999;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);

}
</style>