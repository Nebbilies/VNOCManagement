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
                result[row.Mod].push({
                    id: row.Id,
                    beatmapsetId: row.BeatmapsetId,
                    name: row.Name,
                    artist: row.Artist,
                    difficulty: row.Difficulty,
                    mapper: row.Mapper,
                    SR: row.SR,
                    BPM: row.BPM,
                    drain: row.Drain,
                    CS: row.CS,
                    AR: row.AR,
                    OD: row.OD,
                    idx: row.Index
                });
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
            // Fetch beatmap data from osu! API
            const beatmap = await getBeatmapInfo(id, index);
            console.log(beatmap);
            await pool.query(
                `INSERT INTO map 
            (\`Round\`, \`Id\`, \`Mod\`, \`Index\`, BeatmapsetId, Name, Artist, Difficulty, Mapper, SR, BPM, Drain, CS, AR, OD)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    round, id, mod, index,
                    beatmap.beatmapsetId,
                    beatmap.name,
                    beatmap.artist,
                    beatmap.difficulty,
                    beatmap.mapper,
                    beatmap.SR,
                    beatmap.BPM,
                    beatmap.drain,
                    beatmap.CS,
                    beatmap.AR,
                    beatmap.OD
                ]
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
        const {
            oldRound,
            oldMod,
            oldIndex,
            newId,
            newMod,
            newIndex
        } = req.body;

        if (!["MAPPOOLER", "ADMIN"].includes(req.user.role)) {
            return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
        }

        if (!oldRound || !oldMod || oldIndex == null) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const modToSet = newMod?.trim() || oldMod;
        const indexToSet = newIndex !== undefined && newIndex !== "" ? newIndex : oldIndex;

        try {
            // Check if new slot is already occupied (not self)
            const [conflictCheck] = await pool.query(
                `SELECT * FROM map 
             WHERE Round = ? AND \`Mod\` = ? AND \`Index\` = ? 
             AND NOT (Round = ? AND \'Mod\' = ? AND \`Index\` = ?)`,
                [oldRound, modToSet, indexToSet, oldRound, oldMod, oldIndex]
            );

            if (conflictCheck.length > 0) {
                return res.status(409).json({
                    error: `A map already exists at ${oldRound} ${modToSet}${indexToSet}`
                });
            }

            // Get current map ID if newId is empty
            let idToSet = newId;

            if (!newId) {
                const [existingRows] = await pool.query(
                    "SELECT Id FROM map WHERE Round = ? AND \`Mod\` = ? AND \`Index\` = ?",
                    [oldRound, oldMod, oldIndex]
                );

                if (existingRows.length === 0) {
                    return res.status(404).json({ error: "Original beatmap not found" });
                }

                idToSet = existingRows[0].Id;
            }

            // Fetch metadata if ID changed
            let beatmap;
            if (newId) {
                beatmap = await getBeatmapInfo(idToSet, indexToSet);
            } else {
                // Reuse existing metadata from DB
                const [existing] = await pool.query(
                    "SELECT * FROM map WHERE Round = ? AND \`Mod\` = ? AND \`Index\` = ?",
                    [oldRound, oldMod, oldIndex]
                );
                beatmap = existing[0];
            }

            // Perform the update
            const [result] = await pool.query(
                `UPDATE map SET 
                Id = ?, 
                \`Mod\` = ?, 
                \`Index\` = ?, 
                BeatmapsetId = ?, 
                Name = ?, 
                Artist = ?, 
                Difficulty = ?, 
                Mapper = ?, 
                SR = ?, 
                BPM = ?, 
                Drain = ?, 
                CS = ?, 
                AR = ?, 
                OD = ?
            WHERE Round = ? AND \`Mod\` = ? AND \`Index\` = ?`,
                [
                    idToSet,
                    modToSet,
                    indexToSet,
                    beatmap.BeatmapsetId,
                    beatmap.Name,
                    beatmap.Artist,
                    beatmap.Difficulty,
                    beatmap.Mapper,
                    beatmap.SR,
                    beatmap.BPM,
                    beatmap.Drain,
                    beatmap.CS,
                    beatmap.AR,
                    beatmap.OD,
                    oldRound,
                    oldMod,
                    oldIndex
                ]
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
                    "SELECT * FROM map WHERE Round = ?",
                    [round]
                );

                if (mapRows.length === 0) continue;

                const roundResult = {
                    NM: [], HD: [], HR: [], DT: [], TB: []
                };

                for (const row of mapRows) {
                    roundResult[row.Mod].push({
                        id: row.Id,
                        beatmapsetId: row.BeatmapsetId,
                        name: row.Name,
                        artist: row.Artist,
                        difficulty: row.Difficulty,
                        mapper: row.Mapper,
                        SR: row.SR,
                        BPM: row.BPM,
                        drain: row.Drain,
                        CS: row.CS,
                        AR: row.AR,
                        OD: row.OD,
                        idx: row.Index
                    });
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