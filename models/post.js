const mongoose = require("mongoose"); //For modeling, from https://www.npmjs.com/package/mongoose

const commentSchema = mongoose.Schema({
    userId: {
      type: String,
      required: true,
    },
    commentText: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const postSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    courseTitle: {
      type: String,
      required: true,
    },
    description: String,
    resource: [
        {
          type: {
            type: String,
          },
          public_id: {
            type: String,
          },
          url: {
            type: String,
          },
        },
      ],
    likes: {
      type: Map,
      of: Boolean,
    },
    comments: [commentSchema], 
  },
  { timestamps: true }
);


module.exports = mongoose.model("Post", postSchema);