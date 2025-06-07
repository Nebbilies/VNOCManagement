const pool = require("../database/db");

module.exports = {
    async getAllMatches(req, res) {
        try {
            const [matches] = await pool.query(`
                SELECT
                    m.Id, m.Round, m.MatchLink, m.Status, m.StartingTime,
                    m.Player1Id, m.Player2Id,
                    m.Player1Score, m.Player2Score,
                    p1.Username AS Player1Username,
                    p2.Username AS Player2Username,
                    p1.Rank AS Player1Rank,
                    p2.Rank AS Player2Rank
                FROM matches m
                         LEFT JOIN players p1 ON m.Player1Id = p1.Id
                         LEFT JOIN players p2 ON m.Player2Id = p2.Id
            `);

            const [staffLinks] = await pool.query(`
                SELECT
                    ms.MatchId,
                    s.Id AS StaffId,
                    s.Username AS StaffUsername,
                    s.Role AS StaffRole
                FROM match_staff ms
                         JOIN staffs s ON ms.StaffId = s.Id
            `);

            const matchStaffMap = {};
            for (const staff of staffLinks) {
                if (!matchStaffMap[staff.MatchId]) {
                    matchStaffMap[staff.MatchId] = [];
                }
                matchStaffMap[staff.MatchId].push({
                    Id: staff.StaffId,
                    Username: staff.StaffUsername,
                    Role: staff.StaffRole
                });
            }

            const result = matches.map(m => ({
                id: m.Id,
                round: m.Round,
                matchLink: m.MatchLink,
                status: m.Status,
                time: m.StartingTime,
                player1: {
                    Id: m.Player1Id,
                    Username: m.Player1Username,
                    Rank: m.Player1Rank
                },
                player2: {
                    Id: m.Player2Id,
                    Username: m.Player2Username,
                    Rank: m.Player2Rank
                },
                player1Score: m.Player1Score || 0,
                player2Score: m.Player2Score || 0,
                staff: matchStaffMap[m.Id] || []
            }));

            res.json(result);
        } catch (err) {
            console.error("[getAllMatches] Error:", err);
            res.status(500).json({ error: "Failed to fetch matches" });
        }
    },

    async addMatch(req, res) {
        const { id, player1Id, player2Id, date, time, round } = req.body;

        if (!["ADMIN", "REFEREE"].includes(req.user.role)) {
            return res.status(403).json({ error: "Forbidden" });
        }

        if (!id || !player1Id || !player2Id || !date || !time || !round) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        try {
            const [players] = await pool.query(
                `SELECT Id FROM players WHERE Id IN (?, ?)`,
                [player1Id, player2Id]
            );

            if (players.length < 2) {
                return res.status(400).json({ error: "Player not found" });
            }

            const startingTime = `${date} ${time}:00`;

            await pool.query(
                `INSERT INTO matches (Id, Player1Id, Player2Id, StartingTime, Round, Status)
                 VALUES (?, ?, ?, ?, ?, 'SCHEDULED')`,
                [id, player1Id, player2Id, startingTime, round]
            );

            res.json({ message: "Match added successfully" });
        } catch (err) {
            console.error("[addMatch] Error:", err);
            res.status(500).json({ error: "Failed to add match" });
        }
    },

    async editMatch(req, res) {
        const oldId = req.params.id;
        const {
            newId,
            player1Id,
            player2Id,
            date,
            time,
            round,
            player1Score,
            player2Score,
            matchLink,
            status
        } = req.body;

        if (!["ADMIN", "REFEREE"].includes(req.user.role)) {
            return res.status(403).json({ error: "Permission denied" });
        }

        if (!newId || !player1Id || !player2Id || !date || !time || !round || !status) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        try {
            const [matchRows] = await pool.query("SELECT Id FROM matches WHERE Id = ?", [oldId]);
            if (matchRows.length === 0) {
                return res.status(404).json({ error: "Match not found" });
            }

            const [players] = await pool.query(
                `SELECT Id FROM players WHERE Id IN (?, ?)`,
                [player1Id, player2Id]
            );

            if (players.length < 2) {
                return res.status(404).json({ error: "One or both players not found" });
            }

            const startingTime = `${date} ${time}:00`;

            await pool.query(
                `UPDATE matches
                SET Id = ?, 
                Player1Id = ?, 
                Player2Id = ?, 
                StartingTime = ?, 
                Round = ?, 
                Player1Score = ?, 
                Player2Score = ?, 
                MatchLink = ?,
                Status = ?
                WHERE Id = ?`,
                [newId, player1Id, player2Id, startingTime, round, player1Score || 0, player2Score || 0, matchLink || null, status, oldId]
            );

            res.json({ message: "Match updated successfully" });
        } catch (err) {
            console.error("[editMatch] Error:", err);
            res.status(500).json({ error: "Failed to edit match" });
        }
    },


    async deleteMatch(req, res) {
        const matchId = req.params.id;

        if (!["ADMIN", "REFEREE"].includes(req.user.role)) {
            return res.status(403).json({ error: "Forbidden" });
        }

        try {
            await pool.query(`DELETE FROM matches WHERE Id = ?`, [matchId]);
            res.json({ message: "Match deleted successfully" });
        } catch (err) {
            console.error("[deleteMatch] Error:", err);
            res.status(500).json({ error: "Failed to delete match" });
        }
    },

    async claimMatch(req, res) {
        try {
            const user = req.user;
            const validRoles = ["REFEREE", "COMMENTATOR", "STREAMER", "ADMIN"];
            if (!validRoles.includes(user.role)) {
                return res.status(403).json({ error: "Forbidden" });
            }

            const { matchId } = req.body;

            const [existing] = await pool.query(
                `SELECT * FROM match_staff WHERE MatchId = ? AND StaffId = ?`,
                [matchId, user.id]
            );
            if (existing.length > 0) {
                return res.status(400).json({ error: "You already claimed this match" });
            }

            const [staffs] = await pool.query(
                `SELECT s.Role FROM match_staff ms
             JOIN staffs s ON ms.StaffId = s.Id
             WHERE ms.MatchId = ?`,
                [matchId]
            );

            const currentRoles = staffs.map(s => s.Role);
            if (user.role !== "COMMENTATOR" && currentRoles.includes(user.role)) {
                return res.status(400).json({ error: "This role is already claimed" });
            }


            const staffRolesExcludingCommentator = currentRoles.filter(role => role !== "COMMENTATOR");
            if (staffRolesExcludingCommentator.length >= 2) {
                return res.status(400).json({ error: "Match is full" });
            }


            await pool.query(`INSERT INTO match_staff (MatchId, StaffId) VALUES (?, ?)`, [matchId, user.id]);

            res.json({ message: "Match claimed successfully" });
        } catch (err) {
            console.error("[claimMatch] Error:", err);
            res.status(500).json({ error: "Failed to claim match" });
        }
    },

    async unclaimMatch(req, res) {
        try {
            const user = req.user;
            const validRoles = ["REFEREE", "COMMENTATOR", "STREAMER", "ADMIN"];
            if (!validRoles.includes(user.role)) {
                return res.status(403).json({ error: "Forbidden" });
            }

            const { matchId } = req.body;

            const [check] = await pool.query(
                `SELECT * FROM matches WHERE Id = ?`,
                [matchId]
            );

            if (check.length === 0){
                return res.status(404).json({error: "Match not found"})
            }

            const [existing] = await pool.query(
                `DELETE FROM match_staff WHERE MatchId = ? AND StaffId = ?`,
                [matchId, user.id]
            );
            if (existing.affectedRows === 0) {
                return res.status(404).json({ error: "You have not claimed this match" });
            }

            return res.status(200).json({ message: "Match unclaimed successfully" });
        } catch (err) {
            console.error("[claimMatch] Error:", err);
            res.status(500).json({ error: "Failed to unclaim match" });
        }
    }
};
