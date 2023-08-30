const jwt = require("jsonwebtoken"); //Used for web tokens, from: https://www.npmjs.com/package/jsonwebtoken
const {responseCode}  = require("../responseCodes.js");

//This middleware verifies user identity.
exports.verifyUser = async (req, res, next) => {
  try {
    let jwtToken = req.header("Authorization");

    if (jwtToken) {
      if (jwtToken.startsWith("Bearer ")) jwtToken = jwtToken.slice(7, jwtToken.length).trimLeft();
      else return res.status(responseCode.Forbidden).json({ error: "Invalid token Format" });
      
      const verified = jwt.verify(jwtToken, process.env.TOKEN_KEY);
      req.user = verified;
      
      next();
    }
    else {
      return res.status(responseCode.Forbidden).json({ error: "Invalid token" });
    }
  } 
  catch (e) {
    res.status(responseCode.Internal_Server_Error).json({ error: e.message });
  }
};