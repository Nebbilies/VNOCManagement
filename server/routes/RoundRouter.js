const express = require("express");
const router = express.Router();
const pool = require("../database/db");

router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM rounds");
        res.json(rows);
    } catch (err) {
        console.error("[getRounds] Error:", err);
        res.status(500).json({ error: "Failed to fetch rounds" });
    }
});

module.exports = router;
