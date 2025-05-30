const pool = require("../database/db");

module.exports = {
    async getMapsByRound(req, res) {
        const roundAcronym = req.params.roundAcronym;

        try {
            const [rows] = await pool.query(
                "SELECT Id AS id, `Mod`, `Index` AS idx FROM map WHERE Round = ?",
                [roundAcronym]
            );

            const result = {
                NM: [],
                HD: [],
                HR: [],
                DT: [],
                TB: [],
            };

            for (const row of rows) {
                if (result[row.Mod]) {
                    result[row.Mod].push({ id: row.id, idx: row.idx });
                } else {
                    result[row.Mod] = [{ id: row.id, idx: row.idx }];
                }
            }

            return res.json(result);
        } catch (err) {
            console.error("[getMapsByRound] Error:", err);
            res.status(500).json({ error: "Failed to retrieve maps" });
        }
    }
};
