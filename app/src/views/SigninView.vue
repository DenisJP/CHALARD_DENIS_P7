<template>
    <div class="signin">
        <!-- navbar component -->
        <NavBarComponent />
        <!-- addone form -->
        <form class="formPost smallWrapper" @submit.prevent="addone">
            <!-- addone title-->
            <div class="blockTitle">SIGNIN INFORMATION</div>
            <input v-model="user.email" type="email" placeholder="email"><br>
            <input v-model="user.password" type="password" placeholder="password"><br>
            <button class="valid">Signin</button>
        </form>
        <!-- placeholder for server error message -->
        <div class="appError">{{ this.appError }}</div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex"
export default{
  name: 'SignIn',
  data() {
    return {
      appError: null,
      //user object
      user: {
        email: "",
        password: ""
      }
    }
  },
  mounted() {
    //verifying if user is already login
    if(this.getToken) this.$router.push({name: 'posts'})
  },
  methods: {
    ...mapMutations(['setToken', 'setUser']),
    //addone user
    async addone() {
        //calling the api on /user/signin with object use
        this.$axios.post('user/signin', this.user)
        .then((response) => {
          //storing JWT Api response inside vueX
          this.setToken(response.data.token)
          this.setUser(response.data.user)

          //redirecting the user
          this.$router.push({name: 'posts'})
        })
        .catch((err) => {
          //display server error message
          this.appError = err.response.data.message
        })
        console.log(this.getMessage)
      }
    },
    computed: {
      ...mapGetters(['getToken']),
    }
  }
</script>