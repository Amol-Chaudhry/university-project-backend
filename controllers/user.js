const User =  require("../models/user");
const {responseCode} = require("../responseCodes");
const { cloudinary } = require('../utils/cloudinary');

//Returns user details for the given id.
exports.getUser = async (req, res) => {
  try {
      const { id } = req.params;
      const user = await User.findById(id);
      return res.status(responseCode.Ok).json(user);
    } catch (e) {
      return res.status(responseCode.Resource_Not_Found).json({ error: e.message });
    }
};

//Updates current user details.
exports.updateUser = async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    // Check if user exists.
    if (!user) {
      return res.status(responseCode.Resource_Not_Found).json({ error: "User not found" });
    }

    const { 
      firstName, 
      lastName, 
      courseTitle, 
      facebookLink, 
      instagramLink, 
      linkedinLink, 
      twitterLink, 
      about 
    } = req.body;

    const socialMedia = {
      facebook: facebookLink,
      twitter: twitterLink,
      instagram: instagramLink,
      linkedin: linkedinLink
    }

    let updatedUserFields = {
      firstName,
      lastName,
      courseTitle,
      socialMedia,
      about
    };

    //Stores Images in separate storage and saves the corresponding link in the database.
    if(req.files['profilePicture'] || req.files['coverPicture']) {
      try {
        const profilePictureFile = req.files['profilePicture'] ? req.files['profilePicture'][0] : null;
        const coverPictureFile = req.files['coverPicture'] ? req.files['coverPicture'][0] : null;
        const profileUploadResponse = profilePictureFile ? await cloudinary.uploader.upload(profilePictureFile.path) : null;
        const coverUploadResponse = coverPictureFile ? await cloudinary.uploader.upload(coverPictureFile.path) : null;
  
        if (profileUploadResponse) updatedUserFields.profilePictureUrl = profileUploadResponse.secure_url;
        if (coverUploadResponse) updatedUserFields.coverPictureUrl = coverUploadResponse.secure_url;
      } 
      catch (e) {
        return res.status(responseCode.Internal_Server_Error).json({ error: "Cloudinary upload failed" });
      }
    }
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updatedUserFields, { new: true });

    return res.status(responseCode.Ok).json(updatedUser);
  } 
  catch (e) {
    return res.status(responseCode.Resource_Not_Found).json({ error: e.message });
  }
};

//Used to retrive users list based on search query.
exports.searchUser = async (req, res) => {
  try {
    let users = await User.find({userName: {$regex: req.query.userName}})
                          .limit(10).select("_id firstName lastName userName profilePictureUrl");

    res.status(responseCode.Ok).json({users}); 
  } 
  catch (e) {
    return res.status(responseCode.Resource_Not_Found).json({msg: e.message});
  }
};