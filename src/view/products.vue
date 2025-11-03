<template>
    <div>
        <AppNavbar/>
        <h1>Hello from products</h1>
    </div>

</template>

<script>

import AppNavbar from '../components/Navbar.vue'

export default {
    name: 'ProductsView',
    components: {
        AppNavbar
    }
}
</script>