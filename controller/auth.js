const userModel = require("../models/user");
const bcrypt = require("bcryptjs");

class AuthController {
    registerUser = async (req, res) => {
        const { name, email, password } = req.body;
        const existingEmail = await userModel.findOne({ email: email });
        if (existingEmail) {
            return res.status(400).json({ "message": "Email Sudah Terdaftar" });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new userModel({
                nama: name,
                email: email,
                password: hashedPassword,
            });
            await user.save();
            return res.status(201).json({ 'message': 'Berhasil Registrasi' });
        } catch (error) {
            return res.status(500).json({ "message": error });
        }
    }

    loginUser = async (req, res) => {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email: email });
        if (!user) {
            res.status(404).json({ "message": "Akun Tidak Terdaftar" });
        }

        try {
            const comparePassword = await bcrypt.compare(password, user.password);
            if (comparePassword) {
                res.status(200).json({ "message": "Login Berhasil" });
            } else {
                res.status(400).json({ "message": "Email atau Password Salah" });
            }
        } catch (error) {
            res.status(500).json({ "message": error });
        }
    }
}

module.exports = new AuthController();