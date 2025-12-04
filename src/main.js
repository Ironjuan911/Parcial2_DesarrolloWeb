import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'

import router from './router/index.js'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

import '@/assets/colors.css'

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.mount('#app')
