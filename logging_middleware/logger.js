const axios = require("axios");
require("dotenv").config();

const getAccessToken = require("./auth");
const LOG_API = "http://20.207.122.201/evaluation-service/logs";

const validStacks = ["backend", "frontend"];
const validLevels = ["debug", "info", "warn", "error", "fatal"];

const validPackages_backend = [
    "cache", "controller", "cron_job", "db",
    "domain", "handler", "repository", "service", "route"
];

const validPackages_frontend = [
    "api", "component", "hook", "page", "state", "style"
];

const commonPackages = [
    "auth", "config", "middleware", "utils"
];

async function Log(stack, level, packageName, message) {
    try {
        stack = stack.toLowerCase();
        level = level.toLowerCase();
        packageName = packageName.toLowerCase();

        if (!validStacks.includes(stack)) {
            throw new Error(`Invalid stack: ${stack}`);
        }

        if (!validLevels.includes(level)) {
            throw new Error(`Invalid level: ${level}`);
        }

        const allowedPackages =
            stack === "backend"
                ? [...validPackages_backend, ...commonPackages]
                : [...validPackages_frontend, ...commonPackages];

        if (!allowedPackages.includes(packageName)) {
            throw new Error(`Invalid package: ${packageName} for stack: ${stack}`);
        }

        const payload = {
            stack,
            level,
            package: packageName,
            message
        };

        const response = await axios.post(LOG_API, payload, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${await getAccessToken()}`
            }
        });

        console.log("Log Created:", response.data);
        return response.data;

    } catch (error) {
        console.error(
            "Logging Error:",
            error.response?.data || error.message
        );
    }
}

module.exports = Log;