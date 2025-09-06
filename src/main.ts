import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('./components/Pokedex.vue')
    },
    {
      path: '/pokemon/:id',
      name: 'PokemonDetail',
      component: () => import('./components/PokemonDetail.vue'),
      props: true
    }
  ]
})

createApp(App).use(router).mount('#app')