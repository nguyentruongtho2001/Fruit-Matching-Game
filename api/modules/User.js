const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    min: 10,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const UserModule = mongoose.model("User", UserSchema);
module.exports = UserModule;
