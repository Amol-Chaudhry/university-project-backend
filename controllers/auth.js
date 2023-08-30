const bcrypt =  require("bcrypt"); //Used for hashing passwords, from: https://www.npmjs.com/package/bcrypt
const jwt = require("jsonwebtoken"); //Used for web tokens, from: https://www.npmjs.com/package/jsonwebtoken
const axios = require("axios"); //Used for third party api requests, from: https://www.npmjs.com/package/axios.
const User =  require("../models/user");
const {responseCode} = require("../responseCodes");

const passwordHasher = async (password) => {
  const generatedSalt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, generatedSalt);

  return hashedPassword;
}

exports.signup = async (req, res) => {
    try {
      const { firstName, lastName, userName, email, password, courseTitle } = req.body;
      const lowerCaseEmail = email.toLowerCase();
      const lowerCaseUserName = userName.toLowerCase();

      let existingUser = await User.findOne({email : lowerCaseEmail});

      if(existingUser) {
        return res.status(responseCode.Bad_Request).json({error: "Email address already signed up!"});
      }
      else {
        existingUser = await User.findOne({userName : lowerCaseUserName});

        if(existingUser) {
          return res.status(responseCode.Bad_Request).json({error: "Username already taken!"});
        }
        else {
          const hashedPassword =  await passwordHasher(password);
          const tempUser = new User({ firstName, 
                                      lastName,
                                      userName: lowerCaseUserName,
                                      email: lowerCaseEmail,
                                      password: hashedPassword,
                                      courseTitle,
                                      about: "",
                                      socialMedia: {}
                                    });
          
          await tempUser.save();

          //Chatengine API used for chat services.
          //Used from: https://chatengine.io/
          await axios.post(
            "https://api.chatengine.io/users/",
            { "username": lowerCaseUserName, "first_name": firstName, "last_name": lastName, "email": lowerCaseEmail, "secret": password},
            { headers: { "Private-Key": process.env.CHAT_ENGINE_PRIVATE_KEY } }
          );
  
          return res.status(responseCode.Resource_Created).json({message: "Successfully Registered."});
        }
      }
    } 
    catch (e) {
      return res.status(responseCode.Internal_Server_Error).json({ error: e.message });
    }
};


exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const lowerCaseEmail = email.toLowerCase();

    if (!lowerCaseEmail || !password) {
      return res.status(responseCode.Bad_Request).json({ error: "Email or password empty!"});
    }

    const tempUser = await User.findOne({ email: lowerCaseEmail });

    if (tempUser) {
      const passwordMatched = await bcrypt.compare(password, tempUser.password);

      if(passwordMatched) {
        const jwtToken = jwt.sign({ id: tempUser._id }, process.env.TOKEN_KEY);

        //Chatengine API used for chat services.
        //Used from: https://chatengine.io/
        await axios.get("https://api.chatengine.io/users/me/", {
          headers: {
            "Project-ID": process.env.CHAT_ENGINE_PROJECT_ID,
            "User-Name": tempUser.userName,
            "User-Secret": password,
          },
        });
        
        return res.status(responseCode.Ok).json({ id: tempUser._id, 
                                                  email: tempUser.email, 
                                                  firstName: tempUser.firstName, 
                                                  lastName: tempUser.lastName, 
                                                  userName: tempUser.userName ,
                                                  courseTitle: tempUser.courseTitle, 
                                                  profilePictureUrl: tempUser.profilePictureUrl, 
                                                  coverPictureUrl: tempUser.coverPictureUrl , 
                                                  socialMedia: tempUser.socialMedia, 
                                                  about: tempUser.about, 
                                                  token: jwtToken}
                                                );
      }
      else {
        return res.status(responseCode.Unauthorized).json({ error: "Password Invalid!" });
      }
    }
    else {
      return res.status(responseCode.Unauthorized).json({ error: "Email address not registered!" });
    }
  } 
  catch (e) {
    res.status(responseCode.Internal_Server_Error).json({ error: e.message });
  }
};