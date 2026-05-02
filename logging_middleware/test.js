const Log = require("./logger");

(async () => {
    await Log(
        "frontend",
        "error",
        "handler",
        "received string, expected bool"
    );
})();