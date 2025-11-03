<template>

  <nav class="navbar navbar-expand-lg" style="background-color: #0c0c0c;" data-bs-theme="dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">
        <img src="../assets/logo.png" class="me-1" alt="" width="30" height="30" />
        Navbar
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


          <!-- <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Dropdown
          </a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item" href="#">Action</a></li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#">Something else here</a></li>
          </ul>
        </li> -->


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
        </ul>





      </div>
    </div>
  </nav>

</template>

<script>
export default {
  name: 'AppNavbar',
  data() {
    return {
      firstElements: [
        { text: 'Inicio', href: '/' },
        { text: 'Productos', href: '/products' },
      ],
      sesionElements: [
        { text: 'Biblioteca', href: '/library' },
      ],

      lastElements: [
        { text: 'Ajustes', href: '../pages/settings.html' },
      ],
      navElements: [],

      loginElements: [
        { text: 'Iniciar Sesión', href: '/login' },
        { text: 'Registrarse', href: '/registration' },
      ],

      isLoggedIn: false,

      userElements: [
        { text: 'Iniciar Sesión', href: '../pages/perfil.html', style: "btn btn-outline-primary", },
        { text: 'Registrarse', href: '../pages/logout.html', style: "btn btn-outline-secondary", },
      ]


    }
  },
  mounted() {
    this.navElements = [...this.firstElements];
    if (localStorage.getItem('usuarioLogueado')) {
      this.navElements.push(...this.sesionElements);
    }
    this.navElements.push(...this.lastElements);
  },
  methods: {

  }
}


</script>

<style scoped>
nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 9999;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);


}


html {
    scroll-padding-top: 12% !important;
}

body {
    margin-top: 7% !important;

}
</style>