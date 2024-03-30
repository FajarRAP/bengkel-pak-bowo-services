const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const invoiceController = require('./controller/invoice');

dotenv.config();
mongoose.connect(process.env.MONGODB_URI);
const PORT = process.env.PORT;
const app = express().use(express.json());

app.post('/invoice', invoiceController.createData);
app.get('/invoice', invoiceController.readData);

app.listen(PORT, () => { console.log(`Connected on Port ${PORT}`) })