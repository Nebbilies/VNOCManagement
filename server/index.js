require('dotenv').config();
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.originalUrl}`);
    next();
});

const OAuthRouter = require("./routes/OAuthRouter.js");
app.use("/api/auth", OAuthRouter);

const PlayerRouter = require("./routes/PlayerRouter.js");
app.use("/api/players", PlayerRouter);

const StaffRouter = require("./routes/StaffRouter.js");
app.use("/api/staff", StaffRouter);

const MapRouter = require("./routes/MapRouter.js");
app.use("/api/maps", MapRouter);

const RoundRouter = require("./routes/RoundRouter.js");
app.use("/api/round", RoundRouter);

const matchRouter = require("./routes/MatchRouter.js");
app.use("/api/matches", matchRouter);

const ReschRouter = require("./routes/RescheduleRouter.js");
app.use("/api/resch", ReschRouter);

app.listen(3001, () => {
    console.log("Server running!");
});
