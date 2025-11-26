const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
require("dotenv").config()

const app = express();


app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true
}))

const authRouter = require("./authService/router.js");
const storageRouter = require("./storageService/router.js");

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/api/auth", authRouter)
app.use("/api/code", storageRouter)

app.listen(3000, () => {
    console.log("Server started on port 3000");
});