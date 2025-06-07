const pool = require("../database/db");
const axios = require("axios");
const querystring = require("querystring");

const OSU_CLIENT_ID = process.env.OSU_CLIENT_ID;
const OSU_CLIENT_SECRET = process.env.OSU_CLIENT_SECRET;
const apiBase = process.env.VITE_API_BASE_URL
const REDIRECT_URI = `${apiBase}/auth/callback`;

module.exports = {
    login(req, res) {

        const state = Buffer.from(JSON.stringify({ redirectTo: req.query.redirect || "/" })).toString("base64");

        const params = querystring.stringify({
            client_id: OSU_CLIENT_ID,
            redirect_uri: REDIRECT_URI,
            response_type: "code",
            scope: "identify public",
            state,
        });

        const redirectUrl = `https://osu.ppy.sh/oauth/authorize?${params}`;
        res.redirect(redirectUrl);
    },

    async callback(req, res) {
        const code = req.query.code;
        if (!code) return res.status(400).send("Missing authorization code.");

        try {
            const tokenResponse = await axios.post(
                "http://osu.ppy.sh/oauth/token",
                {
                    client_id: OSU_CLIENT_ID,
                    client_secret: OSU_CLIENT_SECRET,
                    code,
                    grant_type: "authorization_code",
                    redirect_uri: REDIRECT_URI,
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            const { access_token } = tokenResponse.data;

            res.cookie("osu_token", access_token, {
                httpOnly: true,
                secure: false,
                sameSite: 'lax',
                maxAge: 1000 * 60 * 60 * 24,
            });


            let redirectTo = "/";
            if (req.query.state) {
                try {
                    const decoded = JSON.parse(Buffer.from(req.query.state, "base64").toString("utf-8"));
                    redirectTo = decoded.redirectTo || "/";
                } catch (err) {
                    console.warn("Failed to parse redirect state:", err);
                }
            }

            res.redirect(`http://localhost:5173${redirectTo}`);
        } catch (error) {
            console.error("OAuth Error:", error.response?.data || error.message);
            res.status(500).send("OAuth login failed");
        }
    },

    async getUser(req, res) {
        const token = req.cookies.osu_token;
        if (!token) return res.status(401).json({ error: "Not logged in" });
        try {
            const userInfo = await axios.get("https://osu.ppy.sh/api/v2/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const userId = userInfo.data.id;
            const username = userInfo.data.username;
            const avatar_url = userInfo.data.avatar_url;
            let role = "GUEST"; // Default

            // Check staffs table
            const [staffRows] = await pool.query("SELECT Role FROM staffs WHERE Id = ?", [userId]);
            if (staffRows.length > 0) {
                role = staffRows[0].Role;
            } else {
                // Check players table
                const [playerRows] = await pool.query("SELECT Id FROM players WHERE Id = ?", [userId]);
                if (playerRows.length > 0) {
                    role = "PLAYER";
                }
            }
            res.json({
                id: userId,
                username: username,
                avatar_url: avatar_url,
                role: role
            });
        } catch (error) {
            console.error("Failed to fetch user:", error.response?.data || error.message);
            res.status(500).json({ error: "Failed to fetch user info" });
        }
    },

    async verifyUser(req, res) {
        const { username } = req.body;
        const token = req.cookies.osu_token;

        if (!token || !username) {
            return res.status(400).json({ success: false, message: "Missing token or username" });
        }

        try {
            const userInfo = await axios.get("http://osu.ppy.sh/api/v2/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const match = userInfo.data.username.toLowerCase() === username.toLowerCase();
            res.json({ success: match });
        } catch (error) {
            console.error("Verification error:", error.response?.data || error.message);
            res.status(500).json({ success: false, message: "Failed to verify user" });
        }
    },

    async logout(req, res) {
        res.clearCookie("osu_token", {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
        });

        res.redirect("http://localhost:5173/");
    }

};
