<template>
    <router-link v-if="!placeholderMode" :to="{ path: '/game', query: { appId: gameData.steam_appid } }"
        class="card productCard bg-info text-decoration-none" data-bs-theme="dark">
        <img :src=gameData.header_image class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">{{ gameData.name }}</h5>
            <div class="card bg-secondary px-1 d-inline-block">
                <p class="card-text">{{ gameData.is_free ? 'Free to Play' :
                    (gameData.price_overview?.final_formatted) }}</p>
            </div>

        </div>
    </router-link>

    <div v-else>
        <div class="card productCard bg-info text-decoration-none" data-bs-theme="dark">
            <div class="card-img-top bg-secondary placeholder-glow"
                style="aspect-ratio:2.13/1; width:100%; border-radius:0.375rem;">
            </div>
            <div class="card-body">
                <div>
                    <span class=" placeholder-glow col-6"></span>
                </div>

                <div class="card bg-secondary px-1 d-inline-block">
                    <span class="card-text placeholder-glow placeholder col-3" style="width:15px"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "productCard",
    props: ['gameData'],
    data() {
        return {
        }
    },
    computed: {
        placeholderMode() {
            return !this.gameData;
        }
    }
}
</script>

<style>
.productCard {
    box-shadow: 0px 0px 10px 3px rgba(0, 0, 0, 0.3);
}
</style>
