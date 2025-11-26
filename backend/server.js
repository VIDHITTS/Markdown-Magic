const express=require("express")
const cookieParser=require("cookie-parser")
const cors=require("cors")
require("dotenv").config()

const app = express();


app.use(express.json())
app.use(cookieParser())

const authRouter = require("./authService/router.js");




app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use("/api/auth",authRouter)
app.listen(3000, () => {
    console.log("Server started on port 3000");
});