const express = require("express");
const { registerUser, loginUser, getUsers } = require("../controllers/userController");
const authenticateUser = require("../middleware/auth");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/",authenticateUser, getUsers);

module.exports = router;
