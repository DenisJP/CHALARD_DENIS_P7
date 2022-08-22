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
        <div class="appError">{{ axiosErr }}</div>
    </div>
</template>

<script>
export default{
  name: 'SignUp',
  data() {
    return {
      //user object
      user: {
        username: "",
        email: "",
        password: "",
        passwordVerification: ""
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
    //addon user
    async addone() {
        //calling the api on /user/addone with object user
        this.$axios.post('/user/addone', this.user)
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