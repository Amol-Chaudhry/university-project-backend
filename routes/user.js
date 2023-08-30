const router =  require("express").Router();
const {verifyUser} = require("../middlewares/verifyUser");
const { getUser, updateUser, searchUser } = require("../controllers/user");
const upload = require("../middlewares/multer");

//GET user details for the :id.
router.get("/:id", verifyUser, getUser);

//UPDATE current user details.
router.patch("/", verifyUser, upload.fields([{ name: 'profilePicture' }, { name: 'coverPicture' }]) , updateUser);

//GET all users corresponding to the query param.
router.get('/search/searchParam', verifyUser, searchUser)

module.exports =  router;