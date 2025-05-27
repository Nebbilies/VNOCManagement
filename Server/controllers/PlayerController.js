const pool = require("../database/db");
const axios = require("axios");

module.exports = {
    async addPlayer(req, res) {
        console.log("[addPlayer] Request received");

        const token = req.cookies.osu_token;

        if (!token) {
            console.log("[addPlayer] No osu_token found in cookies. Returning 401 Unauthorized");
            return res.status(401).json({ error: "Unauthorized: osu_token missing" });
        }

        try {
            const osuRes = await axios.get("https://osu.ppy.sh/api/v2/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const { id, username, statistics } = osuRes.data;
            const rank = statistics?.global_rank || null;

            const [existing] = await pool.query("SELECT * FROM players WHERE id = ?", [id]);
            console.log("[addPlayer] Existing player query result:", existing);

            if (existing.length > 0) {
                return res.status(200).json({
                    message: "Player already registered",
                    player: existing[0],
                });
            }


            // Thêm player mới vào DB
            await pool.query("INSERT INTO players (Id, Username, `Rank`, `Status`) VALUES (?, ?, ?, 'QUALIFIED')",
                [id, username, rank]
            );
            console.log("[addPlayer] Player registered successfully:", { id, username });

            return res.json({ message: "Player registered", id, username });
        } catch (err) {
            console.error("[addPlayer] Error occurred:", err);
            return res.status(500).json({ error: "Failed to register player" });
        }
    },

    async removePlayer(req, res) {
        if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });

        const id = req.params.id;
        try {
            await pool.query("DELETE FROM players WHERE id = ?", [id]);
            res.json({ message: "Player removed" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to remove player" });
        }
    },

    async getAllPlayers(req, res) {
        if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });

        try {
            const [players] = await pool.query("SELECT * FROM players");
            res.json(players);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Failed to get players" });
        }
    },
};
