<template>
    <div class="posts">
        <!-- navbar component -->
        <NavBarComponent />
        <!-- profil form -->
        <form class="formPost smallWrapper" @submit.prevent="updateone">
          <!-- addone title-->
          <div class="blockTitle">PROFIL PAGE</div>
          <input name="file" type="file" id="file" class="postFile" @change="onFileSelected" />
          <label v-if="!selectedFile && !user.imageUrl" for="file">Add a profil picture</label>
          <p v-if="selectedFile"><img class="userImage" v-on:click="selectedFile = null" :src="this.blob"/></p>
          <img v-if="user.imageUrl" class="userImage" :src="user.imageUrl" v-on:click="selectedFile = null, user.imageUrl = null"/>
          <input v-model="user.email" type="mail"><br>
          <input v-model="user.username" type="text"><br>
          <button>Update your profil</button>
        </form>
        <!-- placeholder for server error message -->
        <div class="appError">{{ this.appError }}</div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex"
export default{
  name: 'Profil',
  data() {
    return {
      appError: null,
      //defining empty file
      selectedFile: null,
      blob: null,
      //user
      user: {imageUrl: null}
    }
  },
  computed: {
    ...mapGetters(['getToken', 'getUser']),
  },
  mounted() {
    this.$axios.defaults.headers.common['authorization'] = `Bearer ${ this.getToken }`;
    //verifying if user is already login
    if(!this.getToken) this.$router.push({name: 'signin'})
    //getall posts
    this.user = this.getUser
  },
	methods: {
    ...mapMutations(['setToken', 'setUser']),
    //handling file change and select
    onFileSelected(event){
      this.selectedFile = event.target.files[0]
      this.blob = URL.createObjectURL(this.selectedFile)
    },
    //getone user
    async getoneuser() {
      await axios.get("user/" + this.user._id).then((response) => { this.setUser(response.data)}).catch((err) => {
      this.appError = err.response.data.message })
    },
    //updateone user
    async updateone() {
      //using formData to handle file
      let user = new FormData();
      if(this.selectedFile) user.append('image', this.selectedFile)
      else if(!this.user.imageUrl) user.append('removeImage', true)
      user.append('username', this.user.username)
      user.append('email', this.user.email)
      await axios.put("user/" + this.user._id, user)
      .then((response) => { this.appError = response.data.message}).catch((err) => {
      this.appError = err.response.data.message })
      this.setUser(this.getoneuser())
    },
  }
}
</script>

<style>

.userImage{
  border: #222b35 solid 2px;
  border-radius: 75px;
  margin-top: 20px;
  height: 150px;
  width: 150px;
  display: inline;
  object-fit: cover;
}
</style>
