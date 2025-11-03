<template>
    <div>
        <AppNavbar/>
        <h1>Hello from Home</h1>
    </div>

</template>

<script>

import AppNavbar from '../components/Navbar.vue'

export default {
    name: 'HomeView',
    components: {
        AppNavbar
    }
}
</script>