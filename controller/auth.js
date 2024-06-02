const userModel = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthController {
    registerUser = async (req, res) => {
        const { name, username, password } = req.body;

        try {
            if (!name.trim() || !username.trim() || !password.trim()) {
                return res.status(400).json({
                    statusCode: 400,
                    message: ["Tidak Boleh Ada Form Yang Kosong"],
                });
            }

            const existingUser = await userModel.findOne({ username });
            if (existingUser) {
                return res.status(409).json({
                    statusCode: 409,
                    message: "Pengguna Sudah Terdaftar"
                });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new userModel({
                name,
                username,
                password,
                role: 0,
            });

            const err = user.validateSync();

            if (err) {
                const getMessage = (key) => err.errors[key]?.message;
                return res.status(400).json({
                    statusCode: 400,
                    message: getMessage('username') && getMessage('password') ? [
                        getMessage('username'), getMessage('password')
                    ] :
                        getMessage('username') ? getMessage('username') :
                            getMessage('password') ? getMessage('password') : '',
                });
            }

            user.password = hashedPassword;

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
        const { username, password } = req.body;

        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                message: "Akun Tidak Terdaftar"
            });
        }
        try {
            const comparePassword = await bcrypt.compare(password, user.password);
            if (!comparePassword) {
                return res.status(401).json({
                    statusCode: 401,
                    message: "Username atau Password Salah"
                });
            }

            const token = jwt.sign({
                name: user.name,
                username: user.username,
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