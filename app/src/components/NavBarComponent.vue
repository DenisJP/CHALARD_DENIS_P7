<template>
    <nav>
      <router-link v-if="userStorage" to="/">Posts</router-link>
      <router-link v-if="userStorage" to="/profil">Profil</router-link>
      <router-link v-if="!userStorage" to="/signin">Signin</router-link>
      <router-link v-if="!userStorage" to="/signup">Signup</router-link>
      <a v-on:click="signout" v-if="userStorage" href="#">Signout</a>
    </nav>
</template>

<script>
export default{
  name: 'NavBar',
  data() {
    return {
      userStorage: localStorage.getItem('user-info')
    }
  },
  methods: {
    signout () {
      localStorage.clear()
      this.$router.push({name: 'signin'})
    }
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