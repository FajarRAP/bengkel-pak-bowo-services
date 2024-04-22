const userModel = require("../models/user");
const bcrypt = require("bcryptjs");

class AuthController {
    registerUser = async (req, res) => {
        const { name, email, password } = req.body;
        if (!name.trim() || !email.trim() || !password.trim()) {
            return res.status(400).json({
                statusCode: 400,
                message: "Tidak Boleh Ada Form Yang Kosong",
            });
        }

        const existingEmail = await userModel.findOne({ email: email });
        if (existingEmail) {
            return res.status(400).json({
                statusCode: 400,
                message: "Email Sudah Terdaftar"
            });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new userModel({
                name,
                email,
                password: hashedPassword,
            });
            await user.save();
            return res.status(201).json({
                statusCode: 201,
                message: "Berhasil Registrasi"
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error
            });
        }
    }

    loginUser = async (req, res) => {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                message: "Akun Tidak Terdaftar"
            });
        }

        try {
            const comparePassword = await bcrypt.compare(password, user.password);
            if (comparePassword) {
                return res.status(200).json({
                    statusCode: 200,
                    message: "Login Berhasil"
                });
            } else {
                return res.status(400).json({
                    statusCode: 400,
                    message: "Email atau Password Salah"
                });
            }
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error
            });
        }
    }
}

module.exports = new AuthController();