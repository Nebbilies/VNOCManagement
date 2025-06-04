const pool = require("../database/db");

module.exports = {
    async getReschedule(req, res) {
        try {
            const { status, playerRequestId, playerRespondId, matchId, id } = req.query;

            const conditions = [];
            const values = [];

            if (status) {
                conditions.push("rr.status = ?");
                values.push(status);
            }
            if (playerRequestId) {
                conditions.push("rr.playerRequestId = ?");
                values.push(playerRequestId);
            }
            if (playerRespondId) {
                conditions.push("rr.playerRespondId = ?");
                values.push(playerRespondId);
            }
            if (matchId) {
                conditions.push("rr.matchId = ?");
                values.push(matchId);
            }
            if (id) {
                conditions.push("rr.id = ?");
                values.push(id);
            }

            const [rows] = await pool.query(`
                SELECT
                    rr.Id AS id,
                    rr.MatchId AS matchId,
                    rr.NewTime AS newTime,
                    rr.Reason AS reason,
                    rr.Status AS status,
                    pr.Id AS playerRequestId,
                    pr.Username AS playerRequestUsername,
                    pr.Rank AS playerRequestRank,
                    pres.Id AS playerRespondId,
                    pres.Username AS playerRespondUsername,
                    pres.Rank AS playerRespondRank
                FROM reschedule_request rr
                         JOIN players pr ON rr.PlayerRequestId = pr.Id
                         JOIN players pres ON rr.PlayerRespondId = pres.Id`)

            const formatted = rows.map(row => ({
                Id: row.id,
                MatchId: row.matchId,
                NewTime: row.newTime,
                Reason: row.reason,
                Status: row.status,
                PlayerRequest: {
                    Id: row.playerRequestId,
                    Username: row.playerRequestUsername,
                    Rank: row.playerRequestRank
                },
                PlayerRespond: {
                    Id: row.playerRespondId,
                    Username: row.playerRespondUsername,
                    Rank: row.playerRespondRank
                }
            }));

            res.json(formatted);
        } catch (err) {
            console.error("[getReschedule] Error:", err);
            res.status(500).json({ error: "Failed to retrieve reschedule requests" });
        }
    },async initiateReschedule(req, res) {
        const { matchId, newDate, newTime, reason } = req.body;
        const playerRequestId = req.user?.id;

        const combinedTime = `${newDate} ${newTime}`;

        if (!matchId || !newDate || !newTime || !reason || !playerRequestId) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        try {
            const [matchRows] = await pool.query("SELECT player1Id, player2Id FROM matches WHERE id = ?", [matchId]);

            if (matchRows.length === 0) {
                return res.status(404).json({ error: "Match not found" });
            }

            const match = matchRows[0];
            const playerRespondId = playerRequestId === match.player1Id ? match.player2Id : match.player1Id;

            const [result] = await pool.query(
                `INSERT INTO reschedule_request (matchId, newTime, reason, status, playerRequestId, playerRespondId)
             VALUES (?, ?, ?, 'INITIALIZED', ?, ?)`,
                [matchId, combinedTime, reason, playerRequestId, playerRespondId]
            );

            // return the auto-generated reschedule ID
            res.json({ message: "Reschedule request created", id: result.insertId });
        } catch (err) {
            console.error("[initiateReschedule] Error:", err);
            res.status(500).json({ error: "Failed to create reschedule request" });
        }
    },

    async approveReschedule(req, res) {
        const { Id } = req.body;

        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ error: "Forbidden" });
        }

        try {
            const [result] = await pool.query(
                "UPDATE reschedule_request SET status = 'APPROVED' WHERE Id = ?", [Id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Request not found" });
            }

            res.json({ message: "Reschedule approved" });
        } catch (err) {
            console.error("[approveReschedule] Error:", err);
            res.status(500).json({ error: "Failed to approve request" });
        }
    },

    async rejectReschedule(req, res) {
        const { Id } = req.body;

        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ error: "Forbidden" });
        }

        try {
            const [result] = await pool.query(
                "UPDATE reschedule_request SET status = 'REJECTED' WHERE id = ?", [Id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Request not found" });
            }

            res.json({ message: "Reschedule rejected" });
        } catch (err) {
            console.error("[rejectReschedule] Error:", err);
            res.status(500).json({ error: "Failed to reject request" });
        }
    },

    async respondReschedule(req, res) {
        const { Id, Status } = req.body;
        const userId = req.user?.id;

        if (!Id || !Status) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        try {
            const [rows] = await pool.query("SELECT playerRespondId FROM reschedule_request WHERE id = ?", [Id]);

            if (rows.length === 0) {
                return res.status(404).json({ error: "Reschedule request not found" });
            }

            if (rows[0].playerRespondId !== userId) {
                return res.status(403).json({ error: "You are not authorized to respond to this request" });
            }

            await pool.query("UPDATE reschedule_request SET status = ? WHERE id = ?", [Status, Id]);
            res.json({ message: `Reschedule status updated to ${Status}` });
        } catch (err) {
            console.error("[respondReschedule] Error:", err);
            res.status(500).json({ error: "Failed to update request status" });
        }
    }
}

