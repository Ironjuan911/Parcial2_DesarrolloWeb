<template>
    <div>
        <AppNavbar/>
        <h1>Hello from Game</h1>
    </div>

</template>

<script>

import AppNavbar from '../components/Navbar.vue'

export default {
    name: 'GameView',
    components: {
        AppNavbar
    }
}
</script>