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
        const username = userInfo.data.username;

        let role = "GUEST"; // default

        // Check staffs table
        const [staffRows] = await pool.query("SELECT Role FROM staffs WHERE Id = ?", [userId]);

        if (staffRows.length > 0) {
            role = staffRows[0].Role; // COMMENTATOR, REFEREE, etc.
        } else {
            // If not in staff, check players table
            const [playerRows] = await pool.query("SELECT Id FROM players WHERE Id = ?", [userId]);
            if (playerRows.length > 0) {
                role = "PLAYER";
            }
        }

        req.user = {
            id: userId,
            username: username,
            role: role,
        };
        next();
    } catch (err) {
        console.error("checkRole failed:", err.message);
        return res.status(403).json({ error: "Failed to verify role" });
    }
};
