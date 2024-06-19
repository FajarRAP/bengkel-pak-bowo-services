const mongoose = require("mongoose");

const queueSchema = new mongoose.Schema({
    queue_no: Number,
    username: String,
    name: String,
    issued_at: Date,
    accepted: Boolean,
});

const queue = mongoose.model("Queue", queueSchema);

module.exports = queue;