const mongoose = require('mongoose');
const serviceSchema = require('./service');

const invoiceSchema = new mongoose.Schema({
    queue_no: Number,
    customer: {
        username: String,
        name: String,
    },
    service: serviceSchema,
    bought_at: Date
});

const invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = invoice;