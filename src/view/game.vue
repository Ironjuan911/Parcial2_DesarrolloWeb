<template>
    <div>
        <AppNavbar />

        <div class="container">
            <div class="row px-5" >
                <div class="col-lg-7 my-2">
                    <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel">
                        <div class="carousel-inner">
                            <!-- <div class="carousel-item active">
                                <img src="..." class="d-block w-100" alt="...">
                            </div>
                            <div class="carousel-item">
                                <img src="..." class="d-block w-100" alt="...">
                            </div>
                            <div class="carousel-item">
                                <img src="..." class="d-block w-100" alt="...">
                            </div> -->
                            <div v-for ="screen in game.screenshots" :class="['carousel-item', { active: screen === game.screenshots[0] }]" :key="screen.id">
                                <img :src="screen.path_full" class="d-block w-100" alt="...">
                            </div>

                        </div>
                        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying"
                            data-bs-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Previous</span>
                        </button>
                        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying"
                            data-bs-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="visually-hidden">Next</span>
                        </button>
                    </div>


                </div>

                <div class="col-lg-5 my-2 px-4">
                    <img :src="game.header_image" class = "mb-3" width="100%" alt="...">
                    <h2>{{ game.name }}</h2>
                    <p>{{ game.short_description }}</p>
                    <h4>Price: {{ game.is_free ? 'Free to Play' : '$' + (game.price_overview ? (game.price_overview.final / 100).toFixed(2) : 'N/A') }}</h4>
                    <button class="btn btn-primary">Add to Cart</button>
                </div>

            </div>

        </div>

    </div>

</template>

<script>

import AppNavbar from '../components/Navbar.vue'
import steamDB from '../logic/steamDB.js'

export default {
    name: 'GameView',
    components: {
        AppNavbar
    },
    data() {
        return {
            urlParams: new URLSearchParams(window.location.search),
            appId: null,
            steamDB: new steamDB(),
            game: []
        }
    },
    async mounted() {
        this.appId = this.urlParams.get('appId')
        this.game = await this.steamDB.importarJuego(this.appId);
    }
}
</script>