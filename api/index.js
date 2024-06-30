const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const invoiceController = require("../controller/invoice");
const authController = require("../controller/auth");
const queueController = require("../controller/queue");
const verifyToken = require("../middlewares/verifyToken");

const app = express().use(express.json());

dotenv.config();
mongoose.connect(process.env.MONGODB_URI)
    .then(() => { console.log("Successfully Connected to MongoDB Atlas"); })
    .catch(() => { console.log("Something Went Wrong"); });
const PORT = process.env.PORT;

// Invoice
app.post("/invoice", verifyToken, invoiceController.createInvoice);
app.get("/invoice", verifyToken, invoiceController.getInvoices);
app.get("/invoice/:username", verifyToken, invoiceController.getInvoicesByUsername);
app.get("/expense/:username/month/:month", verifyToken, invoiceController.getExpenseAtMonth);
app.get("/income", verifyToken, invoiceController.getIncome);

// Queue
app.post("/queue", verifyToken, queueController.pickQueue);
app.get("/queue", verifyToken, queueController.getQueueToday);
app.get("/queueNum", verifyToken, queueController.getQueueNumToday);
app.get("/queueMe/:username", verifyToken, queueController.getMyQueueToday);

// Auth
app.post("/register", authController.registerUser);
app.post("/login", authController.loginUser);

// Home
app.get("/", (req, res) => { res.send("Bengkel Pak Bowo Services"); });

app.listen(PORT, () => { console.log(`Connected on Port ${PORT}`); });

module.exports = app;