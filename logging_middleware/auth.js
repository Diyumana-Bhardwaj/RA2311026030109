const axios = require("axios");
require("dotenv").config();

async function getAccessToken() {
    try {
        const response = await axios.post(
            "http://20.207.122.201/evaluation-service/auth",
            {
                email: process.env.EMAIL,
                name: process.env.NAME,
                rollNo: process.env.ROLL_NO,
                accessCode: process.env.ACCESS_CODE,
                clientID: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET
            },
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );

        return response.data.access_token;

    } catch (error) {
        console.error(
            "Auth Error:",
            error.response?.data || error.message
        );
    }
}

module.exports = getAccessToken;