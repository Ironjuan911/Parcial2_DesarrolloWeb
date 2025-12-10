<template>

    <div>
        <AppNavbar />
        <LoadingScreen />
        <div class="container mt-4" v-if="isAdmin">
            <h1 class="text-light">Panel de Administración</h1>
            <p class="text-primary">Bienvenido al panel de administración. Aquí puedes gestionar la aplicación.</p>

            <!-- Aquí puedes agregar más funcionalidades administrativas -->

        </div>
    </div>
</template>

<script>
import storageLE from '@/services/storageLE';
import AppNavbar from '../components/Navbar.vue'
import { useAdminStore } from '@/store/adminStore';
import LoadingScreen from '../components/loadingComponents/loadingScreen.vue';

export default {
    name: 'AdminView',
    components: {
        AppNavbar,
        LoadingScreen
    },
    data() {
        return {
            storageLE: new storageLE('adminID'),
            isAdmin: false,
        };
    },
    async mounted() {
        const adminStore = useAdminStore();
        this.isAdmin = await adminStore.checkAdminStatus();
        console.log(this.isAdmin);

        if (!this.isAdmin) {
            this.$router.push({ path: '/' });
            alert('Access denied. Admins only.');
        }
    },

    methods: {

    },

};
</script>
