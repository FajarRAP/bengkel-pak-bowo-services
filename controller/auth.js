const userModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthController {
    registerUser = async (req, res) => {
        const { name, email, password } = req.body;

        try {
            if (!name.trim() || !email.trim() || !password.trim()) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "Tidak Boleh Ada Form Yang Kosong",
                });
            }

            const existingEmail = await userModel.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "Email Sudah Terdaftar"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new userModel({
                name,
                email,
                role: 0,
                password: hashedPassword,
            });
            await user.save();
            return res.status(201).json({
                statusCode: 201,
                message: "Berhasil Registrasi"
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                statusCode: 500,
                message: error.toString()
            });
        }
    }

    loginUser = async (req, res) => {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                message: "Akun Tidak Terdaftar"
            });
        }
        try {
            const comparePassword = await bcrypt.compare(password, user.password);
            if (!comparePassword) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "Email atau Password Salah"
                });
            }

            const token = jwt.sign({
                name: user.name,
                email: user.email,
                role: user.role,
            }, process.env.SECRET_KEY);

            return res.status(200).json({
                statusCode: 200,
                message: "Login Berhasil",
                token,
            });

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                statusCode: 500,
                message: error.toString()
            });
        }
    }
}

module.exports = new AuthController();