import { createRouter, createWebHistory } from 'vue-router'
import Register from '../views/register.vue'
import Login from '../views/login.vue'
import Pasajero from '../views/pasajero.vue'
import admin from '../views/admin.vue' // Importa el componente del administrador

// La ruta base se define sin "name" para que App.vue muestre el welcome.
const routes = [
  {
    path: '/',
    // Sin "name": cuando se navega a '/', el watcher en App.vue detecta que `$route.name === null`
    // y muestra el welcome.
    component: { template: '<div></div>' }
  },
  {
    path: '/register',
    name: 'register',
    component: Register
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }, 
  {
    path: '/pasajero',
    name: 'pasajero',
    component: Pasajero
  },
  {
    path: '/admin',  // Ruta para administrador
    name: 'admin',
    component: admin  // Componente que renderiza la vista del administrador
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
