<template>
    <div>
        <AppNavbar />
        <div class="container">
            <div class="row" data-bs-theme="dark">
                <h2 class="my-4 text-light">Mi Biblioteca</h2>
                <div v-for="item in libraryList" :key="item.appId" class="col-6 col-md-4 col-lg-3 col-xl-2 my-2">
                    <img :src="item.library_600x900" :alt="'juego ' + item.appId" width="100%">
                </div>

                <div v-for="item in libraryLeft" :key="item.appId" class="col-6 col-md-4 col-lg-3 col-xl-2 my-2"
                    aria-hidden="true">
                    <p class="placeholder-glow" width="100%">
                        <span class="placeholder"></span>
                    </p>
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
            libraryLeft: [],
            libraryList: []
        }
    },
    async mounted() {
        this.libraryId = JSON.parse(localStorage.getItem('user')).library || [];
        this.libraryId = JSON.parse(this.libraryId); // Debido a que el array de la libreria es un string en la base de datos, lo parceamos

        this.libraryLeft = [...this.libraryId];

        for (const id of this.libraryId) {
            let libraryData = await this.steamDB.importLibrary(id)
            console.log(libraryData);
            this.libraryList.push(libraryData);
            this.libraryLeft.pop();
        }

        console.log(this.libraryList);


    }
}
</script>
<style>
.placeholder-glow {
    aspect-ratio: 2/3;
    background-color: #444;
    border-radius: 5px;
}
</style>