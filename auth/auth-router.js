const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const users = require("../users/users-model");
const { jwtSecret } = require("../config/secrets");

router.post("/register", (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;

  users
    .add(user)
    .then(registered => {
      res.status(201).json(registered);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;

  users
    .findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);

        res.status(200).json({
          message: `hello there ${user.username}!`,
          token
        });
      } else {
        res.status(401).json({ message: "invalid Credentials mah dude" });
      }
    })
    .catch(error => {
      res.status(500).json({ error: `something ain't right buddy!` });
    });
});

function generateToken(user) {
  const payload = {
    username: user.username
  };
  const options = {
    expiresIn: "2h"
  };

  return jwt.sign(payload, jwtSecret, options);
}
module.exports = router;
