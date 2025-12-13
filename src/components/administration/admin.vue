<template>

    <alertModal id="alertModal" ref="alertModal" />


    <div>
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h3 class="text-light">Administradores del Sistema</h3>
            <div class="d-flex gap-2">
                <select class="form-select" v-model="selectedUserIdToAdd">
                    <option value="" disabled selected>Seleccionar usuario...</option>
                    <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }} ({{
                        user.id }})</option>
                </select>
                <button class="btn btn-success text-nowrap" @click="addAdmin">Añadir Admin</button>
            </div>
        </div>
        <div class="table-responsive">
            <table class="table table-dark table-striped table-hover">
                <thead>
                    <tr>
                        <th>ID Admin</th>
                        <th>Nombre (Referencia)</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(admin, index) in admins" :key="admin.id">
                        <td>{{ admin.id }}</td>
                        <td>{{ getUserName(admin.id) }}</td>
                        <td>
                            <button class="btn btn-sm btn-danger" @click="removeAdmin(index)">Revocar</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import alertModal from '../modals/alertModal.vue';

export default {
    name: 'AdminPrivileges',
    props: ['adminID', 'users', 'storageAdminID'],
    components: {
        alertModal
    },
    emits: ['adminAdded', 'adminDeleted'],
    data() {
        return {
            selectedUserIdToAdd: ""
        }
    },
    methods: {
        getUserName(id) {
            if (!this.users) return id;
            // Ensure ID comparison handles string/number differences
            const user = this.users.find(u => String(u.id) === String(id));
            return user ? user.name : `Usuario Desconocido (${id})`;
        },
        async addAdmin() {
            if (!this.selectedUserIdToAdd) return;
            // Check if already an admin
            if (this.adminID.some(admin => String(admin.id || admin) === String(this.selectedUserIdToAdd))) {
                alert("Este usuario ya es administrador.");
                return;
            }

            try {
                // Guardamos como objeto con propiedad id
                const adminToSave = { id: this.selectedUserIdToAdd };
                await this.storageAdminID.createData(adminToSave);
                this.$emit('adminAdded', adminToSave);
                this.selectedUserIdToAdd = "";
                // Sin alertModal - la tabla se actualizará automáticamente
            } catch (error) {
                console.error(error);
                alert("Error al añadir administrador.");
            }
        },
        async removeAdmin(index) {
            if (!confirm("¿Revocar privilegios de administrador?")) return;
            try {
                await this.storageAdminID.deleteData(index);
                this.$emit('adminDeleted', index);
            } catch (error) {
                console.error(error);
                alert("Error al eliminar administrador.");
            }
        }
    },
    computed: {
        admins() {
            // Returns the list of admin IDs passed via props
            return this.adminID;
        }
    }
}
</script>

<style scoped></style>
