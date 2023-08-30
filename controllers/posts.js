const Post =  require("../models/post");
const User =  require("../models/user");
const {responseCode} = require("../responseCodes");
const { cloudinary } = require('../utils/cloudinary');

const postRecommendation = async (userId) => {
  try {
    const allPosts = await Post.find().sort({ createdAt: -1 });
    const user = await User.findById(userId);
    const now = new Date();

    const recentUserPosts = allPosts.filter(post => 
      post.courseTitle === user.courseTitle &&
      now - post.createdAt <= 7 * 24 * 60 * 60 * 1000
    );

    const otherRecentPosts = allPosts.filter(post => 
      post.courseTitle !== user.courseTitle &&
      now - post.createdAt <= 7 * 24 * 60 * 60 * 1000
    );

    const olderPosts = allPosts.filter(post => now - post.createdAt > 7 * 24 * 60 * 60 * 1000);
    const orderedPosts = [...recentUserPosts, ...otherRecentPosts, ...olderPosts];

    return orderedPosts;
  } 
  catch (e) {
    return res.status(responseCode.Resource_Not_Found).json({ error: e.message });
  }
}

exports.createPost = async (req, res) => {
  try {
    const { userId, description, resourceType } = req.body;
    const user = await User.findById(userId);
    let newPost;
    
    if(req?.file?.path) {
      const uploadResponse = await cloudinary.uploader.upload(req.file.path);
      
      newPost = new Post({  userId,
                            firstName: user.firstName, 
                            lastName: user.lastName,
                            userName: user.userName,
                            courseTitle: user.courseTitle,
                            description,
                            resource: [
                              {
                                type: resourceType,
                                public_id: uploadResponse.public_id,
                                url: uploadResponse.secure_url,
                              },
                            ],
                            likes: {},
                            comments: [],});
    } 
    else {
      newPost = new Post({  userId,
                            firstName: user.firstName, 
                            lastName: user.lastName,
                            userName: user.userName,
                            courseTitle: user.courseTitle,
                            description,
                            resource: [],
                            likes: {},
                            comments: [],});
    }
    await newPost.save();

    const recommendedPosts =  await postRecommendation(req.user.id);

    return res.status(responseCode.Resource_Created).json(recommendedPosts);
  } 
  catch (e) {
    return res.status(responseCode.Internal_Server_Error).json({ error: e.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const recommendedPosts =  await postRecommendation(req.user.id);
    return res.status(responseCode.Ok).json(recommendedPosts);
  } 
  catch (e) {
    return res.status(responseCode.Resource_Not_Found).json({ error: e.message });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId }).sort({ createdAt: -1 });
    return res.status(responseCode.Ok).json(post);
  } 
  catch (e) {
    return res.status(responseCode.Resource_Not_Found).json({ error: e.message });
  }
};

exports.likePost = async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.body;
      const post = await Post.findById(id);
      const isPostLiked = post.likes.get(userId);
  
      if (isPostLiked) post.likes.delete(userId);
      else post.likes.set(userId, true);
      
      const changedPost = await Post.findByIdAndUpdate(id, { likes: post.likes }, { new: true });
  
      return res.status(responseCode.Ok).json(changedPost);
    } 
    catch (e) {
      return res.status(responseCode.Resource_Not_Found).json({ error: e.message });
    }
  };

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if(post.userId === req.user.id) {
      await Post.findByIdAndDelete(req.params.id);
      return res.status(responseCode.Ok).json({message: "You post has been deleted successfully."});
    }
    else {
      return res.status(responseCode.Bad_Request).json({error: "You are not allowed to delete this post!"});
    }
  } 
  catch (e) {
    return res.status(responseCode.Internal_Server_Error).json({error: "Internal server error."});
  }
};


exports.addComment = async (req, res) => {
  try {
    const { userId, commentText } = req.body;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) return res.status(responseCode.Resource_Not_Found).json({ error: "Post not found!" });
    
    const newComment = {userId, commentText, };

    post.comments.push(newComment);
    await post.save();

    return res.status(responseCode.Resource_Created).json(post);
  } 
  catch (e) {
    return res.status(responseCode.Internal_Server_Error).json({ error: "Internal Server error." });
  }
}

exports.removeComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentId = req.params.commentId;
    const post = await Post.findById(postId);

    if (!post) return res.status(responseCode.Resource_Not_Found).json({ error: "Post not found!" });
    
    const commentIndex = post.comments.findIndex((comment) => comment._id.toString() === commentId);

    if (commentIndex === -1) return res.status(responseCode.Resource_Not_Found).json({ error: "Comment not found!" });
    
    if(post.comments[commentIndex].userId != req.user.id) return res.status(responseCode.Bad_Request).json("You are not allow to delete this comment!");

    post.comments.splice(commentIndex, 1);
    await post.save();

    return res.status(responseCode.Ok).json(post);
  } 
  catch (e) {
    return res.status(responseCode.Internal_Server_Error).json({ error: "Internal Server error" });
  }
};