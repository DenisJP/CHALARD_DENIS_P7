<template>
    <nav>
      <router-link v-if="getToken" to="/">Posts</router-link>
      <router-link v-if="getToken" to="/profil">Profil</router-link>
      <router-link v-if="!getToken" to="/signin">Signin</router-link>
      <router-link v-if="!getToken" to="/signup">Signup</router-link>
      <a v-on:click="signout" v-if="getToken" href="#">Signout</a>
    </nav>
</template>

<script>
import { mapGetters, mapMutations } from "vuex"
export default{
  name: 'NavBar',
  methods: {
    ...mapMutations(['setToken', 'setUser']),
    signout () {
      this.setToken(null)
      this.setUser(null)
      this.$router.push({name: 'signin'})
    }
  },
  computed: {
    ...mapGetters(['getToken', 'getUser']),
  }
}
</script>

<style>
nav {
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: #383a4b;
  border: #222b35 solid 1px;
}

nav a {
    text-decoration: none;
    text-transform: uppercase;
    font-size: 14px;
    font-weight: bold;
    color: #a19999;
    margin-left: 5px;
    margin-right: 5px;
}

nav a:hover {
    text-decoration: none;
    text-transform: uppercase;
    font-size: 14px;
    font-weight: bold;
    color: #FFD7D7;
}

nav .router-link-exact-active {
      color: #FFD7D7;
}
</style>