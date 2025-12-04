import { createRouter, createWebHistory } from 'vue-router'

import Home from '../view/Home.vue'

import GameView from '../view/game.vue'
import LoginView from '../view/login.vue'
import ProductsView from '../view/products.vue'
import RegistrationView from '../view/registration.vue'
import LibraryView from '../view/Library.vue'
import AdminView from '../view/admin.vue'


const routes = [
    {path: '/', component: Home},
    {path: '/game', component: GameView},  
    {path: '/login', component: LoginView},
    {path: '/products', component: ProductsView},
    {path: '/registration', component: RegistrationView},
    {path: '/library', component: LibraryView},
    {path: '/admin', component: AdminView}
]

export default createRouter({
    history: createWebHistory(),
    routes
})

