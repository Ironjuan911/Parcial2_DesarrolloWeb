<template>
    <div>
        <AppNavbar />
        <div class="container my-4">
            <div class="row justify-content-center">
                <div class="card col-lg-5 py-3">
                    <h2 class="mb-4">Crear una cuenta</h2>
                    <form @submit.prevent="submit">
                        <div class="mb-3">
                            <label for="InputName" class="form-label">Nombre:</label>
                            <input type="text" class="form-control" id="InputName" required v-model="name">
                        </div>
                        <div class="mb-3">
                            <label for="InputEmail1" class="form-label">Correo electrónico:</label>
                            <input type="email" class="form-control" id="InputEmail1" aria-describedby="emailHelp"
                                required v-model="email">
                            <div id="emailHelp" class="form-text">Nunca compartiremos tu correo electrónico con nadie.
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="InputPassword1" class="form-label">Contraseña:</label>
                            <input type="password" class="form-control" id="InputPassword1" required v-model="password">
                        </div>
                        <div class="mb-3">
                            <label for="InputPassword2" class="form-label">Confirmar contraseña:</label>
                            <input type="password" class="form-control" id="InputPassword2" required
                                v-model="confirmPassword">
                        </div>

                        <button type="submit" class="btn btn-primary">Enviar</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

</template>

<script>

import AppNavbar from '../components/Navbar.vue'
import defaultCredentials from '../data/defaultCredentials.json'

import storageLE from '../services/storageLE.js'


export default {
    name: 'RegistrationView',
    components: {
        AppNavbar
    },
    data() {
        return {
            defaultCredentials: defaultCredentials,
            name: '',
            email: '',
            password: '',
            confirmPassword: '',

            storageLE: new storageLE('credentials'),
            usuarios: []
        }
    },
    async mounted() {
        this.usuarios = await this.storageLE.getAll()

    },
    methods: {
        async submit() {
            const name = this.name.trim();
            const email = this.email.trim();
            const age = null;
            const password = this.password.trim();
            const confirmPassword = this.confirmPassword.trim();

            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden');
                return;
            }

            const usuarios = this.usuarios;


            if (usuarios.some(u => u.email === email)) {
                alert('El correo ya está registrado');
                return;
            }

            let id = 0;

            // eslint-disable-next-line no-unused-vars
            usuarios.forEach(element => {
                id = id + 1;
            });


            const nuevoUsuario = {
                id,
                name,
                age,
                email,
                password,
                library: JSON.stringify([])
            };

            await this.storageLE.createData(nuevoUsuario);

            alert('Registro exitoso. Ahora puedes iniciar sesión.');
            this.$router.push({ path: '/login' });
        }
    }
}
</script>