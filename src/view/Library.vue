<template>
    <div>
        <AppNavbar/>
        <h1>Hello from Library</h1>
    </div>

</template>

<script>

import AppNavbar from '../components/Navbar.vue'

export default {
    name: 'LibraryView',
    components: {
        AppNavbar
    }
}
</script>
