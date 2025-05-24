const mysql = require("mysql2/promise");
const pool = require("../database/db");

module.exports = async function checkRole(req, res, next) {
    const token = req.cookies.osu_token;
    if (!token) return res.status(401).json({ error: "Missing osu_token" });

    try {
        const axios = require("axios");
        const userInfo = await axios.get("https://osu.ppy.sh/api/v2/me", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const userId = userInfo.data.id;

        const [rows] = await pool.query("SELECT * FROM staffs WHERE id = ?", [userId]);
        req.user = { id: userId, username: userInfo.data.username };
        req.user.role = rows.length > 0 ? "admin" : "player";
        next();
    } catch (err) {
        console.error("checkRole failed:", err.message);
        return res.status(403).json({ error: "Failed to verify role" });
    }
};
