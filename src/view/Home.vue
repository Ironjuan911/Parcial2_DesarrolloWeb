<template>

    <div>
        <AppNavbar />
        <div class="container py-5">
            <div class="row justify-content-center">
                <div class="col-lg-8 text-center">
                    <h1 class="mb-4 text-light">Bienvenido a Steam Library Explorer</h1>
                    <p class="lead mb-4 text-primary">
                        Explora, gestiona y descubre tu biblioteca de juegos de Steam.<br>
                        Regístrate, inicia sesión y navega por los productos disponibles.
                    </p>
                    <div class="d-flex flex-wrap justify-content-center gap-3 mt-4">
                        <router-link to="/products" class="btn btn-primary btn-lg">
                            Ver Juegos
                        </router-link>
                        <router-link to="/registration" class="btn btn-success btn-lg">
                            Registrarse
                        </router-link>
                        <router-link v-if="!isLoggedIn" to="/login" class="btn btn-secondary btn-lg">
                            Iniciar Sesión
                        </router-link>
                        <router-link v-if="isLoggedIn" to="/library" class="btn btn-secondary btn-lg">
                            Mi Biblioteca
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>


</template>

<script>

import AppNavbar from '../components/Navbar.vue'

export default {
    name: 'HomeView',
    components: {
        AppNavbar
    },data() {
        return {
            isLoggedIn: false,
        }
    },mounted() {
        const usuarioLogueado = localStorage.getItem('user');
        if (usuarioLogueado) {
            this.isLoggedIn = true;
        }
    }   
}
</script>