const express = require("express");
const UserModel = require("../models/Users");
const router = express.Router();

router.get("/getUsers", (req, res) => {
  UserModel.find({}, (err, result) => {
    if (err) res.json(err);
    res.json(result);
  });
});

router.post("/createUser", async (req, res) => {
  const user = req.body;
  const newUser = new UserModel(user);
  await newUser.save();

  res.json(user);
});

module.exports = router;
