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
        <div class="appError">{{ axiosErr }}</div>
  </div>
</template>

<script>
export default{
  name: 'Profil',
  data() {
    return {
      //defining empty file
      selectedFile: null,
      blob: null,
      axiosErr: null,
      userId: JSON.parse(localStorage.getItem('user-info')).userId,
      //user
      user: {
        username: null,
        email: null,
        imageUrl: null
      },
      //error message
      axiosErr: ""
    }
  },
  mounted() {
    //redirect user if user is not login
    if(!localStorage.getItem('user-info')) this.$router.push({name: 'signin'})
    //getall posts
    this.getonuser()
  },
	methods: {
    //handling file change and select
    onFileSelected(event){
      this.selectedFile = event.target.files[0]
      this.blob = URL.createObjectURL(this.selectedFile)
    },
    //getone user
    async getoneuser() {
      await axios.get("user/" + this.userId).then((response) => { this.user = response.data}).catch((err) => {
      this.axiosErr = err.response.data.message })
    },
    //updateone user
    async updateone() {
      //using formData to handle file
      let user = new FormData();
      if(this.selectedFile) user.append('image', this.selectedFile)
      else if(!this.user.imageUrl) user.append('removeImage', true)
      user.append('username', this.user.username)
      user.append('email', this.user.email)
      await axios.put("user/" + this.userId, user)
      .then((response) => { this.axiosErr = response.data.message}).catch((err) => {
      this.axiosErr = err.response.data.message })
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
