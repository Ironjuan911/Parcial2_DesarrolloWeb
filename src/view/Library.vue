<template>
    <div>
        <AppNavbar />
        <div class="container">
            <div class="row" data-bs-theme="dark">
                <h2 class="my-4 text-light">Mi Biblioteca</h2>
                <div v-for="item in libraryList" :key="item.appId" class="col-6 col-md-4 col-lg-3 col-xl-2 my-2">
                    <libraryCard :gameData="item" />
                </div>

                <div v-for="item in libraryLeft" :key="item.appId" class="col-6 col-md-4 col-lg-3 col-xl-2 my-2"
                    aria-hidden="true">
                    <libraryCard :gameData="undefined" />
                </div>
            </div>

        </div>


    </div>

</template>

<script>

import AppNavbar from '../components/Navbar.vue'
import libraryCard from '../components/gameCards/library.vue'
import steamDB from '../logic/steamDB.js'

export default {
    name: 'LibraryView',
    components: {
        AppNavbar,
        libraryCard
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
