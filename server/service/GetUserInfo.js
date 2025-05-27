const axios = require("axios");

async function getUserById(userId, accessToken) {
    if (!userId || !accessToken) {
        throw new Error("Missing userId or accessToken");
    }

    try {
        const response = await axios.get(`https://osu.ppy.sh/api/v2/users/${userId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        const { id, username, avatar_url, country, statistics } = response.data;

        return {
            id,
            username,
            avatar_url,
            country: country?.name || "Unknown",
            pp: statistics?.pp || 0,
        };
    } catch (error) {
        console.error("Failed to fetch user by ID:", error.response?.data || error.message);
        throw new Error("Failed to fetch user by ID");
    }
}

module.exports = {
    getUserById,
};
