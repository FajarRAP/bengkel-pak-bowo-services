const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    nama: String,
    harga: Number,
});

module.exports = serviceSchema;