//importing models index file
const db = require("../models")

//importing file manager library
const fs = require('fs')

//getting the user schema
const Post = db.post

//GET ALL POSTS
exports.getall = (req, res) => {
    console.log("\x1b[35m%s\x1b[0m", "::post.controller.getall")

    //searching all post
    Post.find({}).sort({date: -1}).exec((err, posts) => { //date: -1 for sorting them new to old
        if (err) { res.status(500).send({ message: "error while seaching all posts" }); return } //unknow error

        //sending posts object as a response
        res.status(200).send(posts)
        console.log("posts search as been process")
    })
}


//GET ONE POST
exports.getone = (req, res, next) => {
    console.log("\x1b[35m%s\x1b[0m", "::post.controller.getone")

    //searching the post with the request id
    Post.findOne({
        _id: req.params.id,
    }).exec((err, post) => {
        if (err) {res.status(500).send({ message: "error while searching the post" }); return} //unknow error
        if (!post) {res.status(404).send({ message: "post does not exist" }); return} //user not found

        //sending the post object as a response
        res.status(200).send(post)
        console.log("post search as been process")
    })
}

//DELETE ONE
exports.deleteone = (req, res) => {
    console.log("\x1b[35m%s\x1b[0m", "::post.controller.deleteone")

    //searching the post with the request id
    Post.findOne({ _id: req.params.id }).exec((err, post) => {
        if (!post) { res.status(404).send({ message: "post does not exist" }); return } else

        //delete the image if it has one
        if(post.imageUrl != null){
            const last_filename = post.imageUrl.split('/images/')[1]; //getting the filename with extension only
            fs.unlink('images/' + last_filename, () => {}); // deleting the file using file manager library
        }
        
        //deleting the post
        Post.deleteOne({ _id: req.params.id }).exec((err, post) => {
            if (err) { res.status(500).send({ message: err }); return } //unknow error

            //sending back a message as a response
            res.status(200).send({ message: "post as been delete" })
            console.log("post deletion as been process")
        })
    })
}

//ADD ONE
exports.addone = (req, res, next) => {
    console.log("\x1b[35m%s\x1b[0m", "::post.controller.addone")

    //veirying if a request file exist
    let fileExist = function(){
        if(req.file) return `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        else return null }

    //verifying input
    if(!req.body.userId) {res.status(500).send({ message: "userId can not be empty" }); return}
    if(!req.body.content) {res.status(500).send({ message: "content can not be empty" }); return}

    //degining the post
    const newPost = new Post({
        ... req.body,
        usersLiked: [],
        usersDisliked: [],
        imageUrl: fileExist()
    })

    //saving the post containing in newPost object
    newPost.save((err, post) => {
        if (err) { res.status(500).send({ message: "error while adding the post" }); return }  //unknow error

        //sending back a message as a response
        res.status(200).send({ message: "post has been added" })
        console.log("post add as been process")
    })
}

//UPDATE ONE
exports.updateone  = (req, res, next) => {
    console.log("\x1b[35m%s\x1b[0m", "::post.controller.updateone")

    //verifying input
    let input = Object.values(req.body).every((item) => { return item !== ""; })
    if(!input) {res.status(500).send({ message: "one field is empty" }); return}

    //searching the post with the request id
    Post.findOne({ _id: req.params.id }).exec((err, post) => {
        if(!post) { res.status(404).send({ message: "post does not exist" }); return} else {

        //verifying if a file as been attach to the post
        let fileExist = function(){
            if(req.file){
                //deleting the previous image if it had one
                if(post.imageUrl != null){
                    const last_filename = post.imageUrl.split('/images/')[1];
                    fs.unlink('images/' + last_filename, () => {});
                }
                //definine the imageUrl
                return `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            }
            //deleting the image if the request was made
            else if(req.body.removeImage) {
                if(post.imageUrl != null){
                    const last_filename = post.imageUrl.split('/images/')[1];
                    fs.unlink('images/' + last_filename, () => {});
                }
                return null
            }
            else return req.body.imageUrl 
        }

        //updating the post with the request id
        Post.updateOne({ _id: req.params.id }, { 
            ...req.body, _id: req.params.id,
            imageUrl: fileExist()
        }).exec((err, post) => {
            if (err) {res.status(500).send({ message: "error while updating the post" }); return} //unknow error
    
                //sending the post object as a response
                res.status(200).send("post had been update")
                console.log("post update as been process")
        })
    }})
}

//VOTE ONE POST
exports.voteone = (req, res) => {
    console.log("\x1b[35m%s\x1b[0m", "::post.controller.voteone")

    userId = req.userId
    postId = req.params.id

    //defining placeholder for like / dislike database array
    let updateLike = null
    let updateDislike = null

    //getting the like or dislike option (dislike = 0 / like = 1)
    let voteType = req.body.voteType

    //verifying the requesting post
    Post.findOne({ _id: req.params.id }).exec((err, post) => { if(!post) { res.status(404).send({ message: "post does not exist" }); return}
    else {
        updateLike = post.usersLiked
        updateDislike = post.usersDisliked

        //disliking a post
        if(voteType == 0) {
            if(updateDislike.includes(userId))
                updateDislike.splice(updateDislike.indexOf(userId), 1)
            else {
                if(updateLike.includes(userId))
                    updateLike.splice(updateLike.indexOf(userId), 1)
                if(!updateDislike.includes(this.userId))
                    updateDislike.push(userId)
            }
        }
        //liking a post
        else if (voteType == 1){
            if(updateLike.includes(userId))
                updateLike.splice(updateLike.indexOf(userId), 1)
            else{
                if(updateDislike.includes(userId))
                    updateDislike.splice(updateDislike.indexOf(userId), 1)
                if(!updateLike.includes(userId))
                    updateLike.push(userId)
            }
        }

        //updating the post
        Post.updateOne({ _id: postId }, {
            usersLiked: updateLike,
            _id: postId,
            usersDisliked: updateDislike
        }).exec((err, post) => {
            if (err) { res.status(500).send({ message: "error while updating the post" }); return }
            if (!post) { res.status(404).send({ message: "post does not exist" }); return }
        })
    }

    //sending an object as a response
    res.status(200).send({updateLike: updateLike, updateDislike: updateDislike, message: "POST AS BEEN VOTED"})
})

}