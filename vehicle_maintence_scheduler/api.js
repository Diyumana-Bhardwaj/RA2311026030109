const axios = require("axios");
const getAccessToken = require("../logging_middleware/auth");

const BASE_URL = "http://20.207.122.201/evaluation-service";

async function fetchData(endpoint) {
    try {
        const token = await getAccessToken();

        const response = await axios.get(
            `${BASE_URL}/${endpoint}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data;

    } catch (error) {
        console.error(
            `API Error (${endpoint}):`,
            error.response?.data || error.message
        );
    }
}

module.exports = {
    getDepots: () => fetchData("depots"),
    getVehicles: () => fetchData("vehicles")
};