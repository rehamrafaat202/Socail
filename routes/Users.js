const { User, register, log } = require("../models/user");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router()

router.post("/login", async (req, res, next) => {
  const { error } = log(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const compare = await bcrypt.compare(req.body.password, user.password);
  if (!compare) return res.status(400).send("Invalid email or password");

  const token = jwt.sign(
    {
      _id: user.id,
      email: user.email,
    },
process.env.jwtprivateKey  );
  res
    .status(200)
    .header("auth-token", token)
    .json({ User: user, Token: token });
});

module.exports = router;
