const mongoose = require('mongoose');
const serviceSchema = require('./service');

const invoiceSchema = new mongoose.Schema({
    nama_pelanggan: String,
    services: [serviceSchema],
    bought_by: String,
    bought_at: Date
});

const invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = invoice;