<template>
    <div>
        <AppNavbar />
        <loadingScreen v-if="loadedRegistration" />
        <AlertModal id="registrationAlert" ref="alertModal" />
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

                        <button type="submit"
                            :class="['btn', 'btn-primary', 'd-flex', 'align-items-center', 'justify-content-center', 'gap-2', 'text-nowrap', { disabled: loadingStore.isLoading }]">
                            <loadingIcon />Enviar
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>

</template>

<script>

import AppNavbar from '../components/Navbar.vue'

import storageLE from '../services/storageLE.js'
import loadingScreen from '@/components/loadingComponents/loadingScreen.vue';
import loadingIcon from '@/components/loadingComponents/loadingIcon.vue';
import AlertModal from '@/components/modals/alertModal.vue';

import { useLoadingStore } from '../store/loadingStore'


export default {
    name: 'RegistrationView',
    components: {
        AppNavbar,
        loadingScreen,
        loadingIcon,
        AlertModal
    },
    data() {
        return {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',

            storageLE: new storageLE('credentials'),
            usuarios: [],
            loadingStore: useLoadingStore(),
            loadedRegistration: false
        }
    },
    async mounted() {
        this.usuarios = await this.storageLE.getAll()
        this.loadedRegistration = true
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
                await this.$refs.alertModal.alertM('Error', 'El correo ya está registrado');
                return;
            }

            let id = 0;

            for (let i = 0; i < usuarios.length; i++) {
                if (usuarios[i].id > id) {
                    id = usuarios[i].id;
                }
            }
            id++;



            const nuevoUsuario = {
                id,
                name,
                age,
                email,
                password,
                library: JSON.stringify([])
            };

            await this.storageLE.createData(nuevoUsuario);

            await this.$refs.alertModal.alertM('Registro exitoso', 'Ahora puedes iniciar sesión.');
            this.$router.push({ path: '/login' });
        }
    }
}
</script>