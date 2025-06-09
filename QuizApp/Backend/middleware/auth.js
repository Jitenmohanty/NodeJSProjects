const jwt = require('jsonwebtoken');
require("dotenv").config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // console.log(token,"Token")
  // console.log(process.env.JWT_SECRET,"Jwt secret")

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // console.log(err,"err")
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };