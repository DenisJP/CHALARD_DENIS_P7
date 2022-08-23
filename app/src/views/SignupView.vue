<template>
    <div class="signup">
        <!-- navbar component -->
        <NavBarComponent />
        <!-- addone form -->
        <form class="formPost smallWrapper" @submit.prevent="addone">
            <!-- addone title-->
            <div class="blockTitle">SIGNUP INFORMATION</div>
            <input v-model="user.username" type="text" placeholder="username"><br>
            <input v-model="user.email" type="email" placeholder="email"><br>
            <input v-model="user.password" type="password" placeholder="password"><br>
            <input v-model="user.passwordVerification" type="password" placeholder="password verification"><br>
            <button class="valid">Signup</button>
        </form>
        <!-- placeholder for server error message -->
        <div class="appError">{{ this.appError }}</div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex"
export default{
  name: 'SignUp',
  data() {
    return {
      appError: null,
      //user object
      user: {
        username: "",
        email: "",
        password: "",
        passwordVerification: ""
      },
    }
  },
  mounted() {
    //verifying if user is already login
    if(this.getToken) this.$router.push({name: 'posts'})
  },
  methods: {
    ...mapMutations(['setToken', 'setUser']),

    //addon user
    async addone() {
        //calling the api on /user/addone with object user
        this.$axios.post('/user/addone', this.user)
        .then((response) => {
          //storing JWT Api response inside vuex
          this.setUser(response.data.user)
          this.setToken(response.data.token)
          //redirecting the user
          this.$router.push({name: 'posts'})
        })
        .catch((err) => {
          //display server error message
          this.appError = err.response.data.message
        })
      }
    },
    computed: {
      ...mapGetters(['getToken']),
    }
  }
</script>