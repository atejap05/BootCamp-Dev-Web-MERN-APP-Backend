const mongoose = require("mongoose");

//https://mongoosejs.com/docs/api.html#mongoose_Mongoose-Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  username: {
    type: String,
    required: false,
  },
});

// this will create a collection colled users on our db, even overwrite an exitent one
const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
