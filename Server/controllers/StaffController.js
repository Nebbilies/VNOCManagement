const pool = require("../database/db");

module.exports = {
    async addStaff(req, res) {
        console.log("[addStaff] Request received");

        const { Username, Role } = req.body;

        if (!Username || !Role) {
            console.log("[addStaff] Missing Username or Role");
            return res.status(400).json({ error: "Username and Role are required." });
        }

        try {
            const [existing] = await pool.query("SELECT * FROM staffs WHERE Username = ?", [Username]);
            console.log("[addStaff] Existing staff query result:", existing);

            if (existing.length > 0) {
                return res.status(200).json({
                    message: "Staff already exists",
                    staff: existing[0],
                });
            }

            await pool.query("INSERT INTO staffs (Username, Role) VALUES (?, ?)", [Username, Role]);
            console.log("[addStaff] Staff registered successfully:", { Username, Role });

            return res.json({ message: "Staff registered", Username, Role });
        } catch (err) {
            console.error("[addStaff] Error occurred:", err);
            return res.status(500).json({ error: "Failed to register staff" });
        }
    },

    async removeStaff(req, res) {
        console.log("[removeStaff] Request received");

        if (req.user.role !== "admin") {
            console.log("[removeStaff] Forbidden access by non-admin");
            return res.status(403).json({ error: "Forbidden" });
        }

        const { id } = req.params;

        try {
            const [result] = await pool.query("DELETE FROM staffs WHERE Id = ?", [id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Staff not found" });
            }

            console.log("[removeStaff] Staff removed successfully:", id);
            res.json({ message: "Staff removed" });
        } catch (err) {
            console.error("[removeStaff] Error occurred:", err);
            res.status(500).json({ error: "Failed to remove staff" });
        }
    },

    async getAllStaff(req, res) {
        console.log("[getAllStaff] Request received");

        if (req.user.role !== "admin") {
            console.log("[getAllStaff] Forbidden access by non-admin");
            return res.status(403).json({ error: "Forbidden" });
        }

        try {
            const [staffList] = await pool.query("SELECT * FROM staffs");
            res.json(staffList);
        } catch (err) {
            console.error("[getAllStaff] Error occurred:", err);
            res.status(500).json({ error: "Failed to fetch staff list" });
        }
    },
};
