<template>

    <div>
        <AppNavbar />
        <LoadingScreen />
        <alertModal id="adminAlert" ref="alertModal" />
        <div class="container mt-4" v-if="isAdmin">
            <h1 class="text-light">Panel de Administración</h1>
            <TabList>
                <TabItem title="Usuarios">
                    <AdminUsers :credentials="credentials" :products="gameProducts"
                        :storageCredentials="storageCredentials" @userUpdated="handleUserUpdated"
                        @userDeleted="handleUserDeleted" />
                </TabItem>
                <TabItem title="Juegos">
                    <AdminGames :gameProducts="gameProducts" :storageProducts="storageProducts"
                        @productAdded="handleProductAdded" @productDeleted="handleProductDeleted" />
                </TabItem>
                <TabItem title="Administradores">
                    <!-- adminID is the list of admin IDs, users is the full list of users (credentials) -->
                    <AdminPrivileges :adminID="adminID" :users="credentials" :storageAdminID="storageAdminID"
                        @adminAdded="handleAdminAdded" @adminDeleted="handleAdminDeleted" />
                </TabItem>
            </TabList>

        </div>
    </div>
</template>

<script>
import storageLE from '@/services/storageLE';
import AppNavbar from '../components/navs/Navbar.vue'
import { useAdminStore } from '@/store/adminStore';
import LoadingScreen from '../components/loadingComponents/loadingScreen.vue';
import alertModal from '../components/modals/alertModal.vue';

import TabList from '@/components/navs/TabList.vue';
import TabItem from '@/components/navs/TabItem.vue';

import AdminPrivileges from '../components/administration/admin.vue';
import AdminGames from '../components/administration/games.vue';
import AdminUsers from '../components/administration/users.vue';

export default {
    name: 'AdminView',
    components: {
        AppNavbar,
        LoadingScreen,
        alertModal,
        TabList,
        TabItem,

        AdminPrivileges,
        AdminGames,
        AdminUsers
    },
    data() {
        return {
            storageLE: new storageLE('adminID'),
            isAdmin: false,

            storageCredentials: new storageLE('credentials'),
            storageProducts: new storageLE('gameProducts'),
            storageAdminID: new storageLE('adminID'),

            adminID: [],
            credentials: [],
            gameProducts: [],
        };
    },
    async mounted() {
        await this.checkAdmin()
        await this.loadData()



    },

    methods: {
        async checkAdmin() {
            const adminStore = useAdminStore();
            this.isAdmin = await adminStore.checkAdminStatus();
            console.log(this.isAdmin);

            if (!this.isAdmin) {
                this.$router.push({ path: '/' });
                this.$refs.alertModal.alertM('Error', 'Acceso denegado');
            }
        },
        handleUserUpdated(index, updatedUser) {
            this.credentials[index] = updatedUser;
        },
        handleUserDeleted(index) {
            this.credentials.splice(index, 1);
        },
        handleProductAdded(newProduct) {
            console.log("handleProductAdded llamado:", newProduct);
            console.log("gameProducts antes:", this.gameProducts.length);
            this.gameProducts.push(newProduct);
            console.log("gameProducts después:", this.gameProducts.length);
        },
        handleProductDeleted(index) {
            this.gameProducts.splice(index, 1);
        },
        handleAdminAdded(newAdminId) {
            this.adminID.push(newAdminId);
        },
        handleAdminDeleted(index) {
            this.adminID.splice(index, 1);
        },
        async loadData() {
            const [credentials, gameProducts, adminID] = await Promise.all([
                this.storageCredentials.getAll(),
                this.storageProducts.getAll(),
                this.storageAdminID.getAll()
            ])
            console.log("Loaded Data:", { credentials, gameProducts, adminID });
            this.credentials = credentials || [];
            this.gameProducts = gameProducts || [];
            this.adminID = adminID || [];
        }

    }


};
</script>

<style>
.nav-tabs .nav-link {
    color: #ccc;
}

.nav-tabs .nav-link.active {
    background-color: #212529;
    color: #fff;
    border-color: #dee2e6 #dee2e6 #212529;
}

.productCard {
    box-shadow: 0px 0px 10px 3px rgba(0, 0, 0, 0.3);
}
</style>