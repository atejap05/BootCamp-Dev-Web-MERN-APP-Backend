const express = require("express");
const app = express();
const mongoose = require("mongoose");
const UserModel = require("./models/Users");

const cors = require("cors");

app.use(express.json()); //to avoid erro while requesting json data
app.use(cors()); // to avoid issues when connect to react frontend

mongoose.connect(
  "mongodb+srv://admin:bootcamp@cluster0.r28cs2c.mongodb.net/db_test?retryWrites=true&w=majority"
);

// requests
app.get("/getUsers", (req, res) => {
  UserModel.find({}, (err, result) => {
    if (err) res.json(err);
    res.json(result);
  });
});

app.post("/createUser", async (req, res) => {
  const user = req.body;
  const newUser = new UserModel(user);
  await newUser.save();

  res.json(user);
});

// end of our app
const PORT = 3001;
app.listen(3001, () => {
  console.log(`Server running on port ${PORT}`);
});
