const pool = require("../database/db");

module.exports = {
    async getRound(req, res) {
        try {
            const [rows] = await pool.query("SELECT * FROM rounds");
            res.json(rows);
            }

        catch (err) {
            console.error("[getRounds] Error:", err);
            res.status(500).json({error: "Failed to fetch rounds"});
        }
    },

    async addRound(req, res) {

        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ error: "Forbidden" });
        }

        const {Acronym, Round} = req.body;

        try {
           await pool.query(`INSERT INTO rounds (Acronym, Round) VALUES (?, ?)`, [Acronym, Round])

           return res.json({ message: "Round added"});

        } catch (err) {
            console.error("[addRound] Error occurred:", err.message);
            return res.status(500).json({ error: "Failed to add round" });
        }
    },

    async editRound(req, res) {

        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ error: "Forbidden" });
        }

        const {oldAcronym, newAcronym, newRound} = req.body;


        try {
            const [rows] = await pool.query(`UPDATE rounds   
                SET Acronym = ?, Round = ?
                WHERE Acronym = ?`,
                [newAcronym, newRound, oldAcronym])

            if (rows.length === 0){
                return res.status(404).json({ error: "Round not found" });
            }

            return res.json({ message: "Round edited"});

        } catch (err) {
            console.error("[editRound] Error occurred:", err.message);
            return res.status(500).json({ error: "Failed to edit round" });
        }
    },

    async deleteRound(req, res) {
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ error: "Forbidden" });
        }

        try {
            const {Acronym} = req.body;

            const [check1] = await pool.query(`SELECT * FROM map WHERE Round = ?`, Acronym);
            const [check2] = await pool.query(`SELECT * FROM matches WHERE Round = ?`, Acronym);

            if (check1.length !== 0 || check2.length !== 0) {
                return res.status(409).json({ error: "Round maps and/or round matches exist" });
            }

            const [rows] = await pool.query(`DELETE FROM rounds WHERE Acronym = ?`, Acronym);
            if (rows.affectedRows === 0) {
                return res.status(404).json({ error: "Round not found" });
            }

            return res.json({ message: "Round deleted" });
        } catch (err) {
            console.error("[deleteRound] Error occurred:", err.message);
            return res.status(500).json({ error: "Failed to delete round" });
        }
    }
}