const express = require("express");
const { registerUser, loginUser, getUsers, addUser } = require("../controllers/userController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getUsers);
router.post('/addUser',addUser)

module.exports = router;
