const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    nama: String,
    email: String,
    password: String,
});

const user = mongoose.model("User", userSchema, "users");

module.exports = user;