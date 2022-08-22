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
        <div class="appError">{{ axiosErr }}</div>
    </div>
</template>

<script>
export default{
  name: 'SignIn',
  data() {
    return {
      //user object
      user: {
        email: "",
        password: ""
      },
      //userStorage
      userStorage: localStorage.getItem('user-info'),

      //error message
      axiosErr: null
    }
  },
  mounted() {
    //verifying if user is already login
    if(this.userStorage) this.$router.push({name: 'home'})
  },
  methods: {
    //addone user
    async addone() {
        //calling the api on /user/signin with object use
        this.$axios.post('user/signin', this.user)
        .then((response) => {
          //storing JWT Api response inside localStorage
          localStorage.setItem('user-info', JSON.stringify(response.data))
          //redirecting the user
          this.$router.push({name: 'posts'})
        })
        .catch((err) => {
          //display server error message
          this.axiosErr = err.response.data.message
        })
      }
    }
  }
</script>