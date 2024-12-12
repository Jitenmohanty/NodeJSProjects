const express = require("express");
const { registerUser, loginUser, getUsers, addUser, getAllUser } = require("../controllers/userController");
const authenticateUser = require("../middlewares/auth");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/",authenticateUser, getUsers);
router.post('/addUser',addUser)
router.get('/alluser',getAllUser)

module.exports = router;
