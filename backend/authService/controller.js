const prisma = require("../config/db.js");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        if (!name || !username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email },
                    { username: username }
                ]
            }
        })
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await argon2.hash(password);
        const user = await prisma.user.create({
            data: {
                name,
                username,
                email,
                password: hashedPassword
            }
        })
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("authToken", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
        })
        return res.status(201).json({ message: "User registered successfully", user: user })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await prisma.user.findUnique({
            where: {
                username: username
            }
        })
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const validPassword = await argon2.verify(user.password, password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("authToken", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/"
        })
        return res.status(200).json({ message: "User logged in successfully", user: user })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie("authToken");
        return res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

const getMe = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: req.user.userId
            },
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                createdAt: true
            }
        })
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user: user })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { register, login, logout, getMe }