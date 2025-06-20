const pool = require("../database/db");
const osuService = require("../service/GetUserInfo");

module.exports = {

    async addStaff(req, res) {
        const { id, role } = req.body;
        const token = req.cookies.osu_token;
        if (!id || !role) {
            console.log("[addStaff] Missing ID or Role");
            return res.status(400).json({ error: "ID and Role are required." });
        }

        if (!token) {
            console.log("[addStaff] Missing osu! token");
            return res.status(401).json({ error: "Not authenticated with osu!" });
        }

        try {
            // Fetch user info from osu! API
            const user = await osuService.getUserById(id, token);
            const username = user.username;

            // Check if staff already exists
            const [existing] = await pool.query("SELECT * FROM staffs WHERE id = ?", id);
            if (existing.length > 0) {
                console.log("[addStaff] Staff already exists:", username);
                return res.status(400).json({
                    error: "Staff already exists",
                    staff: existing[0],
                });
            }

            // Insert new staff
            await pool.query("INSERT INTO staffs (id, Role, Username) VALUES (?, ?, ?)", [id, role, username]);

            return res.json({ message: "Staff registered", username, role });

        } catch (err) {
            console.error("[addStaff] Error occurred:", err.message);
            return res.status(500).json({ error: "Failed to register staff" });
        }
    },


    async removeStaff(req, res) {
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ error: "Forbidden" });
        }

        const { id } = req.params;

        try {
            const [result] = await pool.query("DELETE FROM staffs WHERE Id = ?", [id]);
            pool.query("DELETE FROM match_staff WHERE StaffId = ?", [id]);

            if (result.affectedRows === 0) {
                return res.status(409).json({ error: "Staff not found" });
            }

            res.json({ message: "Staff removed" });
        } catch (err) {
            console.error("[removeStaff] Error occurred:", err);
            res.status(500).json({ error: "Failed to remove staff" });
        }
    },

    async getAllStaff(req, res) {
        try {
            const [staffList] = await pool.query("SELECT * FROM staffs");
            res.json(staffList);
        } catch (err) {
            console.error("[getAllStaff] Error occurred:", err);
            res.status(500).json({ error: "Failed to fetch staff list" });
        }
    },
};
