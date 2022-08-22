import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import NavBarComponent from './components/NavBarComponent.vue'

Vue.config.productionTip = false
Vue.component("NavBarComponent", NavBarComponent)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')