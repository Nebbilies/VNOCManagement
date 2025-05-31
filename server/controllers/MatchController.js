const pool = require("../database/db");

module.exports = {
    async getAllMatches(req, res) {
        try {
            // Get matches and player usernames
            const [matches] = await pool.query(`
                SELECT
                    m.Id, m.Round, m.MatchLink, m.Status, m.StartingTime,
                    m.Player1Id, m.Player2Id,
                    m.Player1Score, m.Player2Score,
                    p1.Username AS Player1Username,
                    p2.Username AS Player2Username
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
                Id: m.Id,
                Round: m.Round,
                MatchLink: m.MatchLink,
                Status: m.Status,
                StartingTime: m.StartingTime,
                Player1: {
                    Id: m.Player1Id,
                    Username: m.Player1Username,
                    Score: m.Player1Score
                },
                Player2: {
                    Id: m.Player2Id,
                    Username: m.Player2Username,
                    Score: m.Player2Score
                },
                Staff: matchStaffMap[m.Id] || []
            }));
            res.json(result);
        } catch (err) {
            console.error("[getAllMatches] Error:", err);
            res.status(500).json({ error: "Failed to fetch matches" });
        }
    }
};
