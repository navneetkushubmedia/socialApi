const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const users = new Schema(
  {
    name: {
      type: String,
    },
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
    },
    token: {
      type: String,
    },
    bio: {
      type: String,
    },
    image: {
      type: String,
    },
    links: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", users);
