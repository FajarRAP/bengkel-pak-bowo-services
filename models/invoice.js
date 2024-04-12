const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    nama_pelanggan: String,
    services: [
        {
            nama: String,
            harga: Number,
            n: Number,
        },
    ],
    bought_at: Date,
});

const invoice = mongoose.model('Invoice', invoiceSchema, 'invoices');

module.exports = invoice;