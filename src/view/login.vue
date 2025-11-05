<template>
    <div>
        <AppNavbar />
        <div class="container my-4">
            <div class="row justify-content-center">
                <div class="card col-lg-5 py-3">
                    <h2 class="mb-4">Iniciar sesión</h2>
                    <form>
                        <div class="mb-3">
                            <label for="InputEmail1" class="form-label">Correo electrónico:</label>
                            <input type="email" class="form-control" id="InputEmail1" aria-describedby="emailHelp"
                                required v-model="gmail">
                            <div id="emailHelp" class="form-text">Nunca compartiremos tu correo electrónico con nadie.
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="InputPassword1" class="form-label">Contraseña:</label>
                            <input type="password" class="form-control" id="InputPassword1" required v-model="password">
                        </div>
                        <button type="submit" @click="submit" class="btn btn-primary">Enviar</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

</template>

<script>

import AppNavbar from '../components/Navbar.vue'
import defaultCredentials from '../data/defaultCredentials.json'

export default {
    name: 'LoginView',
    components: {
        AppNavbar
    },
    data() {
        return {
            defaultCredentials: defaultCredentials,
            gmail: null,
            password: null
        }
    },
    async mounted() {
        if (localStorage.getItem('usuarios') === null) {
            localStorage.setItem('usuarios', JSON.stringify(this.defaultCredentials));
        }

    },
    methods: {
        submit() {
            const email = this.gmail.trim();
            const password = this.password.trim();

            const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            const usuario = usuarios.find(u => u.email === email && u.password === password);

            if (!usuario) {
                alert('Correo o contraseña incorrectos');
                return;
            }


            localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
            alert('¡Bienvenido, ' + usuario.name + '!');
            this.$router.push({ path: '/' });// Redirect to home after login

        }
    }
}
</script>