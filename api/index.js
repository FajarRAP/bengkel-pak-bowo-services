const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const invoiceController = require("../controller/invoice");
const authController = require("../controller/auth");
const verifyToken = require("../middlewares/verifyToken");

const app = express().use(express.json());

dotenv.config();
mongoose.connect(process.env.MONGODB_URI)
    .then(() => { console.log("Successfully Connected to MongoDB Atlas"); })
    .catch(() => { console.log("Something Went Wrong"); });
const PORT = process.env.PORT;

// Invoice
app.post("/invoice", verifyToken, invoiceController.createData);
app.get("/invoice", verifyToken, invoiceController.readData);

// Auth
app.post("/register", authController.registerUser);
app.post("/login", authController.loginUser);

app.get("/", (req, res) => { res.send("Bengkel Pak Bowo Services"); });

app.listen(PORT, () => { console.log(`Connected on Port ${PORT}`); });

module.exports = app;