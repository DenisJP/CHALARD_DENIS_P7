import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import NavBarComponent from './components/NavBarComponent.vue'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false
Vue.component("NavBarComponent", NavBarComponent)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
