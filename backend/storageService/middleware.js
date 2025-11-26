const jwt = require("jsonwebtoken")

const middleware = async (req, res, next) => {

    const token = req.cookies.authToken

    if (!token) {
        return res.status(401).json({ msg: "No token provided" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (e) {
        return res.status(401).json({ msg: "Token expired or invalid" })
    }
}

module.exports = { middleware }
