const pool = require("./db");

async function testConnection() {
    try {
        const [rows] = await pool.query("SELECT 1");
        console.log("✅ Kết nối database thành công!");
    } catch (err) {
        console.error("❌ Lỗi kết nối database:", err.message);
    }
}

testConnection();
