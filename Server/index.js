require('dotenv').config();
const cors = require("cors");

const express = require("express");
const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

const cookieParser = require("cookie-parser");
app.use(cookieParser());


const OAuthRouter = require("./routes/OAuthRouter.js");

app.use("/api/auth", OAuthRouter);


app.listen(3001, () => {
    console.log("Server running on http://localhost:3001");
});