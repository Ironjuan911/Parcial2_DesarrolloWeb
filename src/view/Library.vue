<template>
    <div>
        <AppNavbar />
        <div class="container">
            <div class="row">
                <h2 class="my-4">Mi Biblioteca</h2>
                <div v-for="item in libraryList" :key="item.appId" class="col-6 col-md-4 col-lg-3 col-xl-2 my-2">
                    <img :src="item.library_600x900" :alt="'juego ' + item.appId" width="100%">
                </div>
            </div>

        </div>


    </div>

</template>

<script>

import AppNavbar from '../components/Navbar.vue'
import steamDB from '../logic/steamDB.js'

export default {
    name: 'LibraryView',
    components: {
        AppNavbar
    }, data() {
        return {
            steamDB: new steamDB(),
            libraryId: [],
            libraryList: []
        }
    },
    async mounted() {
        this.libraryId = JSON.parse(localStorage.getItem('usuarioLogueado')).library || [];

        for (const id of this.libraryId) {
            let libraryData = await this.steamDB.importLibrary(id)
            console.log(libraryData);
            this.libraryList.push(libraryData);
        }

        console.log(this.libraryList);


    }
}
</script>
