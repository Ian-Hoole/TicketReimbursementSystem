const jwt = require("jsonwebtoken");
const getSecretKey = require("../../secretKey.js");

const secretKey = getSecretKey();

async function authenticateToken(req, res, next) {
    // authorization: "Bearer tokenstring"

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Unauthorized Access" });
    } else {
        const user = await decodeJWT(token);
        req.user = user;
        next();
    }
}

async function authenticateManagerToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Unauthorized Access" });
    } else {
        const user = await decodeJWT(token);
        if (user.role !== "manager") {
            res.status(403).json({ message: "Forbidden Access" });
            return;
        }
        req.user = user;
        next();
    }
}

async function decodeJWT(token) {
    try {
        const user = await jwt.verify(token, secretKey)
        return user;
    } catch (err) {
        console.error(err);
    }
}

module.exports = {
    authenticateManagerToken, 
    authenticateToken
};