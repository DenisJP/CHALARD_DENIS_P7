import Vue from 'vue'
import VueRouter from 'vue-router'
import PostsView from '../views/PostsView.vue'
import ProfilView from '../views/ProfilView.vue'
import SigninView from '../views/SigninView.vue'
import SignupView from '../views/SignupView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'posts',
    component: PostsView
  },
  {
    path: '/signin',
    name: 'signin',
    component: SigninView
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupView
  },
  {
    path: '/profil',
    name: 'profil',
    component: ProfilView
  }
]

const router = new VueRouter({
  routes
})

export default router
