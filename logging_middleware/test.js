const Log = require("./logger");

(async () => {
    await Log(
        "backend",
        "error",
        "handler",
        "received string, expected bool"
    );
})();