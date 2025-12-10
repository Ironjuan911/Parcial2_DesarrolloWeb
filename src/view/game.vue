<template>
    <div>
        <AppNavbar />

        <div class="container">
            <div class="row px-lg-5 px-md-3">
                <div class="col-lg-7 my-2 order-lg-1 order-2">
                    <div id="carouselExampleAutoplaying" class="carousel slide" data-bs-ride="carousel"
                        data-bs-theme="light">
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
                            <div v-for="screen in game.screenshots"
                                :class="['carousel-item', { active: screen === game.screenshots[0] }]" :key="screen.id">
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

                <div class="col-lg-5 my-2 px-lg-4 order-lg-2 order-1 text-light">
                    <img :src="game.header_image" class="mb-3" width="100%" alt="...">
                    <h2>{{ game.name }}</h2>
                    <p>{{ game.short_description }}</p>
                    <h4>Price: {{ game.is_free ? 'Free to Play' : (game.price_overview?.final_formatted) }}</h4>
                    <button
                        :class="['btn', 'btn-primary', 'd-flex', 'align-items-center', 'justify-content-center', 'gap-2', 'text-nowrap', { disabled: !buyButtonEnabled }]"
                        @click="buygame">
                        <LoadingIcon /><span>Add to Cart</span>
                    </button>
                </div>

            </div>

            <div class="row px-lg-5 px-md-3">

                <div class="col-xl-7 col-lg-8 col-12 text-light">
                    <p class="my-3 px-3 py-4 card dark" v-html="game.detailed_description"></p>
                </div>
                <div class="col-xl-5 col-12 text-light">


                    <div class="my-3 px-3 py-4 card dark">
                        <h4 class="mb-3">System requirements</h4>
                        <div>
                            <p v-html="game.pc_requirements?.minimum"></p>
                        </div>
                        <div class="mt-3">
                            <p v-html="game.pc_requirements?.recommended"></p>
                        </div>
                    </div>

                </div>
            </div>

        </div>

    </div>

</template>

<script>

import router from '@/router';
import AppNavbar from '../components/Navbar.vue'
import steamDB from '../logic/steamDB.js'
import dataManager from '@/logic/dataManager';

import LoadingIcon from '../components/loadingComponents/loadingIcon.vue';

export default {
    name: 'GameView',
    components: {
        AppNavbar,
        LoadingIcon
    },
    data() {
        return {
            urlParams: new URLSearchParams(window.location.search),
            appId: null,
            steamDB: new steamDB(),
            dataManager: new dataManager(),
            game: [],

            buyButtonEnabled: false
        }
    },
    async mounted() {
        this.appId = this.urlParams.get('appId')
        this.game = await this.steamDB.importarJuego(this.appId);
        this.dataManager.loadUsers();
        console.log(this.game.price_overview);

        await this.dataManager.canBuy();
        this.buyButtonEnabled = this.dataManager.canBuy(this.appId);
    },
    methods: {
        buygame() {
            if (this.dataManager.buygame(this.appId)) {
                router.push('/library');
            } else {
                alert("No se pudo completar la compra.");
                router.push('/login');
            }


        }
    }


}
</script>

<style>
.bb_img {
    width: 100%;
    height: auto;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    border-radius: 1%;
}
</style>