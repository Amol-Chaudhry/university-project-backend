const router =  require("express").Router();
const { signup, signin } = require("../controllers/auth");
const {userAuthInputValidation, validationOutcome} = require("../middlewares/validation");

//Handles Sign Up
router.post("/signup", userAuthInputValidation, validationOutcome, signup);

//Handles Sign In
router.post("/signin", signin);

module.exports =  router;