const pool = require("../database/db");
const getBeatmapInfo = require("../service/GetBeatmapInfo");

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
                NM: [], HD: [], HR: [], DT: [], TB: []
            };

            for (const row of rows) {
                const beatmap = await getBeatmapInfo(row.id, row.idx);
                result[row.Mod].push(beatmap);
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
        try {
            const [roundRows] = await pool.query("SELECT Acronym FROM rounds");
            const finalResult = {};

            for (const roundRow of roundRows) {
                const round = roundRow.Acronym;

                const [mapRows] = await pool.query(
                    "SELECT Id AS id, `Mod`, `Index` AS idx FROM map WHERE Round = ?",
                    [round]
                );

                if (mapRows.length === 0) continue;

                const roundResult = {
                    NM: [], HD: [], HR: [], DT: [], TB: []
                };

                const beatmapPromises = mapRows.map(async row => {
                    try {
                        const beatmap = await getBeatmapInfo(row.id, row.idx);
                        return { mod: row.Mod, beatmap };
                    } catch (err) {
                        console.error(`[getAllMaps] Failed to fetch beatmap ID ${row.id} (Mod: ${row.Mod}, Index: ${row.idx}):`, err.message);
                        return null; // skip this one
                    }
                });


                const beatmaps = await Promise.all(beatmapPromises);

                for (const entry of beatmaps) {
                    if (!entry) continue; // skip failed ones
                    roundResult[entry.mod].push(entry.beatmap);
                }

                finalResult[round] = roundResult;
            }

            res.json(finalResult);
        } catch (err) {
            console.error("[getAllMaps] Error:", err.message);
            res.status(500).json({ error: "Failed to retrieve all maps" });
        }
    }
};