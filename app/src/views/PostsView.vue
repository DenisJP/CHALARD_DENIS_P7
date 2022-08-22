<template>
    <div class="posts">
        <!-- navbar component -->
        <NavBarComponent />
        <!-- addone form -->
        <!-- displaying the form using editState true(a post is behing edit)/false(no post is behing edit) -->
        <form v-if="!editState" class="formPost mediumWrapper" @submit.prevent="addone">
          <!-- addone title-->
          <div class="blockTitle">SENDING A NEW POST</div>
          <input v-model="post.content" type="text" placeholder="Post content"><br>
          <input name="file" type="file" id="file" class="postFile" @change="onFileSelected" />
          <label v-if="!selectedFile" for="file">Add a image to the post</label>
          <p v-if="selectedFile"><img class="postImagePreview" v-on:click="selectedFile = null" :src="this.blob"/></p>
          <button>Send the post</button>
        </form>

        <!-- updateone form -->
        <form v-if="editState" class="formPost mediumWrapper" id="formUpdate" @submit.prevent="updateone">
          <!-- addone title-->
          <div class="blockTitle">UPDATING POST</div>
          <input v-model="postUpdate.content" type="text" placeholder="Post content"><br>
          <input name="file" type="file" id="file" class="postFile" @change="onFileSelected" />
          <label v-if="!selectedFile && !postUpdate.imageUrl" for="file">Add a image to the post</label>
          <p v-if="selectedFile || postUpdate.imageUrl"><img class="postImagePreview" v-on:click="selectedFile = null, postUpdate.imageUrl = null" :src="postUpdate.imageUrl || this.blob"/></p>
          <button>Update the post</button>
          <button v-on:click="editState = false">Cancel the post update</button>
        </form>
        <!-- placeholder for server error message -->
        <div class="appError">{{ axiosErr }}</div>

        <!-- display a block post foreach post inside posts -->
        <div v-for="post in posts"  :key="post._id" class="post">
          <!-- post mangement button-->
          <div class="postManage">
            <button v-if="(userId == post.userId)" v-on:click=preupdateone(post)>EDIT</button>
            <button v-if="(userId == post.userId)" v-on:click=deleteone(post._id)>DELETE</button>
            <button v-on:click="likeone(post)">LIKE <b class="nbLike">{{ post.usersLiked.length }}</b></button>
            <button v-on:click="dislikeone(post)">DISLIKE <b class="nbLike">{{ post.usersDisliked.length }}</b></button>
          </div>
          <!-- main post information -->
          <div class="postAuthor">{{ "placeholder" }}</div>
          <div class="postDate">{{ post.date | moment }}</div>
          <img v-if="post.imageUrl" class="postImage" :src="post.imageUrl"/>
          <div class="postContent">{{ post.content }}</div>
        </div>
  </div>
</template>

<script>
//handling date format with moment
import moment from 'moment'
export default{
  name: 'Posts',
  data() {
    return {
      //degining the edit state
      editState: false,
      //defining empty file
      selectedFile: null,
      blob: null,
      userId: JSON.parse(localStorage.getItem('user-info')).userId,
      //post
      post: { 
        userId: JSON.parse(localStorage.getItem('user-info')).userId,
        content: ""
      },
      //post update
      postUpdate: {
        userId: null,
        content: null,
        id: null,
        imageUrl: null
      },
      //posts
      posts: [],

      //error message
      axiosErr: "POST HAVE BEEN LOAD"
    }
  },
  mounted() {
    //redirect user if user is not login
    if(!localStorage.getItem('user-info')) this.$router.push({name: 'signin'})
    //getall posts
    this.getall()
  },
  filters: {
    //reformating the date getting from Mongo Database
    moment: function (date) {
      return moment(date).format('MM-DD-YYYY | hh:mm:ss ');
    },
  },
	methods: {
    //handling date format
    moment: function() {
      return moment();
    },
    //handling file change and select
    onFileSelected(event){
      this.selectedFile = event.target.files[0]
      this.blob = URL.createObjectURL(this.selectedFile)
    },

    //getall posts
    async getall() {
      await axios.get("post").then((response) => { this.posts = response.data}).catch((err) => {
      this.axiosErr = err.response.data.message })
    },

    //deleteone post
    async deleteone(postId) {
    await axios.delete("/post/" + postId)
      .then((response) => { this.axiosErr = response.data.message }).catch((err) => {
      this.axiosErr = err.response.data.message })
      this.getall()
    },

    //addone post
    async addone() {
      //using formData to handle file
      let post = new FormData();
      post.append('image', this.selectedFile)
      post.append('userId', this.post.userId)
      post.append('content', this.post.content)
      //calling the api on /post/addone with object post
      await axios.post("/post", post)
      .then((response) => { this.axiosErr = response.data.message, this.post.content = "", this.selectedFile = null }).catch((err) => {
      this.axiosErr = err.response.data.message })
      this.getall()
    },

    //preupdateone
    preupdateone(post) {
      this.postUpdate.content = post.content
      this.postUpdate.userId = post.userId
      this.postUpdate.id = post._id
      this.postUpdate.imageUrl = post.imageUrl
      this.editState = true
      this.selectedFile = null
      this.blob = null
      window.scrollTo(0,0);
    },

    //updateone
    async updateone() {
      //using formData to handle file
      let post = new FormData();
      if(this.selectedFile) post.append('image', this.selectedFile)
      else post.append('removeImage', true)
      post.append('userId', this.postUpdate.userId)
      post.append('content', this.postUpdate.content)
      //calling the api on /post/:id with object post
      await axios.put("/post/"+this.postUpdate.id, post)
      .then((response) => { this.axiosErr = response.data.message, this.post.content = "", this.selectedFile = null, this.editState = false}).catch((err) => {
      this.axiosErr = err.response.data.message })
      this.getall()
    },

    //dislikeone
    async dislikeone(post){
      await axios.post("/post/"+post._id+"/voteone", {voteType: 0})
      .then((response) => {
        post.usersLiked = response.data.updateLike
        post.usersDisliked = response.data.updateDislike
        this.axiosErr = response.data.message
      }).catch((err) => {
      this.axiosErr = err.response.data.message })
    },

    //likeone
    async likeone(post) {
      await axios.post("/post/"+post._id+"/voteone", {voteType: 1})
      .then((response) => {
        post.usersLiked = response.data.updateLike
        post.usersDisliked = response.data.updateDislike
        this.axiosErr = response.data.message
      }).catch((err) => {
      this.axiosErr = err.response.data.message })
    }
  }
}
</script>

<style>
.postFile {
	width: 0.1px;
	height: 0.1px;
	opacity: 0;
	overflow: hidden;
	position: absolute;
	z-index: -1;
}

.postImagePreview{
  height: 100px;
  width: 100%;
  object-fit: cover;
  margin-top: 10px;
  border: #222b35 solid 1px;
  border-radius: 4px;
}

.postFile + label {
  margin-top: 10px;
  display: block;
  width: 100%;
  padding: 5px;
  border: #222b35 solid 1px;
  border-radius: 4px;
  color: #fff;
  background-color: #4E5166;
  cursor: pointer;
}

.post{
  max-width: 600px;
  width: auto;
  margin-left: auto;
  margin-right: auto;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  color: #FFF;
  border: #222b35 solid 2px;
  border-radius: 10px;
  background-color: #383a4b;
}

.postImage{
  border: #222b35 solid 2px;
  margin-top: 20px;
  border-radius: 5px;
  display: block;
  width: 100%;
  height: 100px;
  object-fit: cover;
}

.postManage button{
  float: right;
  padding: 5px;
  margin-left: 2px;
  margin-right: 2px;
  border: #222b35 solid 1px;
  border-radius: 4px;
  background-color: #4E5166;
  font-size: 10px;
}

.postEditBtn {
  border-radius: 5px;
  text-align: center;
  padding: 5px;
  background-color: #5c8271;
  color: #fff;
  margin-top: 5px;
  margin-right: 10px;
  margin-bottom: 5px;
}

.postEditBtnC {
  text-transform: capitalize;
  border-radius: 5px;
  text-align: center;
  padding: 5px;
  background-color: #b8424a;
  color: #fff;
  margin-top: 5px;
  margin-bottom: 5px;
}

.postDate {
  text-align: left;
  font-weight: bold;
  font-size: 10px;
  color: #FFD7D7;
}

.postAuthor {
  text-align: left;
  font-weight: bold;
  font-size: 12px;
  color: #42b883;
}

.postContent {
  text-align: left;
  margin-top: 10px;
  padding: 10px;
  font-weight: bold;
  font-size: 14px;
}
</style>
