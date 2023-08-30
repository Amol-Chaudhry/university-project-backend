const router =  require("express").Router();
const {createPost, getPosts, getUserPosts, likePost, deletePost, addComment, removeComment } = require("../controllers/posts.js");
const {verifyUser} = require("../middlewares/verifyUser");
const upload = require("../middlewares/multer");

//Handles CREATE post operation.
router.post("/", verifyUser, upload.single("resource") , createPost);

//Handles posts feed to display on home and profile pages.
router.get("/", verifyUser, getPosts);
router.get("/:userId" ,verifyUser, getUserPosts);

//Handles like for posts.
router.patch("/:id/like" ,verifyUser , likePost);

//Handles DELETE post operation
router.delete("/:id" ,verifyUser, deletePost );


//Handles adding and deleting comments.
router.patch("/:id/comments", verifyUser, addComment );
router.delete("/:id/comments/:commentId", verifyUser, removeComment );

module.exports =  router;