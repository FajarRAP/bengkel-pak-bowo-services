const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(403).json({
            statusCode: 403,
            message: "Tidak Memiliki Akses"
        });
    }


    jwt.verify(token, process.env.SECRET_KEY, (err, success) => {
        if (err) {
            return res.status(403).json({
                statusCode: 403,
                message: "Tidak Memiliki Akses"
            });
        }
        next();
    });
};

module.exports = verifyToken;