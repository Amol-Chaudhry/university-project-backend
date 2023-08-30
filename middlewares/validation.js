const { check, validationResult } = require("express-validator"); //Used for validations, From: https://www.npmjs.com/package/express-validator
const {responseCode}  = require("../responseCodes.js");

exports.userAuthInputValidation = [
    check("firstName").trim().not().isEmpty().withMessage("Firstname Blank!").isLength({max: 150}).withMessage("Firstname should contain a maximum of 150 characters!"),
    check("lastName").trim().not().isEmpty().withMessage("Lastname Blank!").isLength({max: 150}).withMessage("Lastname should contain a maximum of 150 characters!"),
    check("userName").trim().not().isEmpty().withMessage("userName Blank!").isLength({min:2, max: 150}).withMessage("Username length must be between 2 and 150 characters!"),
    check("email").isEmail().withMessage("Invalid email!").custom((value, { req }) => {
        if (!value.endsWith("@student.bham.ac.uk")) throw new Error("Please enter your student email.");
        
        return true;
    }),
    check("password").trim().not().isEmpty().withMessage("Empty password!").isLength({ min: 6}).withMessage("Length of password must be minimum 6 characters!"),
    check("courseTitle").trim().not().isEmpty().withMessage("Empty Course Title!")
]

exports.validationOutcome = (req, res, next) => {
    let err = validationResult(req).array();

    if(!err.length) {
        return next();
    }
    else {
        res.status(responseCode.Bad_Request).json({ error: err[0].msg });
    }
}