const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    role: {
        type: Number,
    }
});

const user = mongoose.model("User", userSchema, "users");

module.exports = user;