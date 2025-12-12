<template>
    <div v-if="!placeholderMode">
        <img :src="gameData.library_600x900" :alt="'juego ' + gameData.appId" width="100%">
    </div>
    <div v-else>
        <p class="placeholder-glow" width="100%">
            <span class="placeholder"></span>
        </p>
    </div>
</template>

<script>
export default {
    name: "libraryCard",
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
.libraryCard {
    box-shadow: 0px 0px 10px 3px rgba(0, 0, 0, 0.3);
}

.placeholder-glow {
    aspect-ratio: 2/3;
    background-color: #444;
    border-radius: 5px;
}
</style>
