<template>
    <div>
        <AlertModal id="loginAlert" ref="alertModal" />

        <AppNavbar />

        <div class="container my-4">
            <div class="row justify-content-center">
                <div class="card col-lg-5 py-3">
                    <h2 class="mb-4">Iniciar sesión</h2>
                    <form @submit.prevent="submit">
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

import AppNavbar from '../components/navs/Navbar.vue'
import { useAdminStore } from '../store/adminStore'

import storageLE from '../services/storageLE.js'
import { useLoadingStore } from '../store/loadingStore'
import loadingIcon from '@/components/loadingComponents/loadingIcon.vue';
import AlertModal from '@/components/modals/alertModal.vue';

export default {
    name: 'LoginView',
    components: {
        AppNavbar,
        loadingIcon,
        AlertModal
    },
    data() {
        return {
            loadingStore: useLoadingStore(),
            gmail: null,
            password: null,

            storageLE: new storageLE('credentials'),
            usuarios: [],


        }
    },
    async mounted() {
        this.usuarios = await this.storageLE.getAll()

    },
    methods: {
        async submit() {
            const email = this.gmail.trim();
            const password = this.password.trim();

            const usuarios = this.usuarios;
            const usuario = usuarios.find(u => u.email === email && String(u.password) === password);

            if (!usuario) {
                await this.$refs.alertModal.alertM('Error', 'Correo o contraseña incorrectos');
                return;
            }


            localStorage.setItem('user', JSON.stringify(usuario));
            await this.$refs.alertModal.alertM('Inicio de sesión exitoso', '¡Bienvenido, ' + usuario.name + '!');

            const adminStore = useAdminStore();
            adminStore.setAdminStatus();

            this.$router.push({ path: '/' });

        }
    }
}
</script>