const { register, login, verifyEmail} = require("../Controller/UserController");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify", verifyEmail);

module.exports = router;
