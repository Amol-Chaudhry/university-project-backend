const mongoose = require("mongoose"); //For modeling, from https://www.npmjs.com/package/mongoose  

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      max: 150,
    },

    lastName: {
      type: String,
      required: true,
      max: 150,
    },

    userName: {
      type: String,
      required: true,
      min: 2,
      max: 150,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      min: 6,
    },

    courseTitle: {
      type: String,
      required: true,
    },

    profilePictureUrl: {
      type: String,
      default: process.env.DEFAULT_PROFILE_PICTURE
    },

    coverPictureUrl: {
      type: String,
      default: process.env.DEFAULT_COVER_PICTURE
    },

    socialMedia: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String,
    },

    about: {
      type: String,
      min: 2,
      max: 150,
    }

  },
  
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);