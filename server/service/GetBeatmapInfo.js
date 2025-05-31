const axios = require("axios");
require("dotenv").config();

let accessToken = null;

async function getAccessToken() {
    if (accessToken) return accessToken;

    const res = await axios.post("https://osu.ppy.sh/oauth/token", {
        client_id: process.env.OSU_CLIENT_ID,
        client_secret: process.env.OSU_CLIENT_SECRET,
        grant_type: "client_credentials",
        scope: "public"
    });

    accessToken = res.data.access_token;
    setTimeout(() => (accessToken = null), (res.data.expires_in - 60) * 1000); // Refresh 1 minute before expiry

    return accessToken;
}

async function getBeatmapInfo(id, idx = null) {
    const token = await getAccessToken();

    const res = await axios.get(`https://osu.ppy.sh/api/v2/beatmaps/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = res.data;

    return {
        id: data.id,
        beatmapsetId: data.beatmapset_id,
        name: data.beatmapset.title,
        artist: data.beatmapset.artist,
        difficulty: data.version,
        mapper: data.beatmapset.creator,
        SR: data.difficulty_rating,
        BPM: data.bpm,
        drain: data.drain,
        CS: data.cs,
        AR: data.ar,
        OD: data.accuracy,
        idx: idx
    };
}

module.exports = getBeatmapInfo;
