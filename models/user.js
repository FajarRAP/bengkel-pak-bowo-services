const mongoose = require("mongoose");
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    username: {
        type: String,
        minLength: ['6', 'Username minimal 6 karakter'],
        trim: true,
    },
    password: {
        type: String,
        validate: {
            validator: validator.isStrongPassword,
            message: 'Kata sandi minimal terdiri dari 8 karakter, 1 huruf kapital dan kecil, 1 simbol, dan 1 angka'
        }
    },
    role: Number
});

const user = mongoose.model("User", userSchema);

module.exports = user;