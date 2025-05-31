const pool = require("../database/db");

module.exports = {
    async getMapsByRound(req, res) {
        const roundAcronym = req.params.roundAcronym;

        try {
            const [rows] = await pool.query(
                "SELECT Id AS id, `Mod`, `Index` AS idx FROM map WHERE Round = ?",
                [roundAcronym]
            );

            if (rows.length === 0) {
                return res.status(404).json({ error: `No maps found for round '${roundAcronym}'` });
            }

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
    },

    async addMap(req, res) {
        const { round, id, mod, index } = req.body;

        if (!["MAPPOOLER", "ADMIN"].includes(req.user.role)) {
            return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
        }

        if (!round || !id || !mod || !index) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        try {
            await pool.query(
                "INSERT INTO map (`Round`, `Id`, `Mod`, `Index`) VALUES (?, ?, ?, ?)",
                [round, id, mod, index]
            );

            res.json({ message: "Beatmap added successfully" });
        } catch (err) {
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ error: "Beatmap already exists" });
            }

            console.error("[addMap] Error:", err);
            res.status(500).json({ error: "Failed to add beatmap" });
        }
    },

    async editMap(req, res) {
        const { round, index, oldMod, newMod, newId } = req.body;

        if (!["MAPPOOLER", "ADMIN"].includes(req.user.role)) {
            return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
        }

        if (!round || !index || !oldMod || !newMod || !newId) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        try {
            const [result] = await pool.query(
                "UPDATE map SET `Mod` = ?, `Id` = ? WHERE `Round` = ? AND `Index` = ? AND `Mod` = ?",
                [newMod, newId, round, index, oldMod]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Beatmap not found" });
            }

            res.json({ message: "Beatmap updated successfully" });
        } catch (err) {
            console.error("[editMap] Error:", err);
            res.status(500).json({ error: "Failed to update beatmap" });
        }
    },

    async deleteMap(req, res) {
        const { round, index, mod } = req.body;

        if (!["MAPPOOLER", "ADMIN"].includes(req.user.role)) {
            return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
        }

        if (!round || !index || !mod) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        try {
            const [result] = await pool.query(
                "DELETE FROM map WHERE `Round` = ? AND `Index` = ? AND `Mod` = ?",
                [round, index, mod]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Beatmap not found" });
            }

            res.json({ message: "Beatmap deleted successfully" });
        } catch (err) {
            console.error("[deleteMap] Error:", err);
            res.status(500).json({ error: "Failed to delete beatmap" });
        }
    },

    async getAllMaps(req, res) {
        console.log("your mom");
        try {
            const [rows] = await pool.query(`
                SELECT \`Round\`, Id AS id, \`Mod\`, \`Index\` AS idx FROM map
            `);
            console.log(rows);
            const result = {};

            for (const row of rows) {
                const { Round, Mod, id, idx } = row;
                if (!result[Round]) {
                    result[Round] = {
                        NM: [],
                        HD: [],
                        HR: [],
                        DT: [],
                        TB: []
                    };
                }

                // Push into correct mod group under the round
                result[Round][Mod].push({ id, idx });
            }

            console.log(result);
            res.json(result);
        } catch (err) {
            console.error("[getAllMapsGrouped] Error:", err);
            res.status(500).json({ error: "Failed to retrieve all maps" });
        }
    }
};
