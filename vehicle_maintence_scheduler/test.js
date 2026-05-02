const { getDepots, getVehicles } = require("./api");

(async () => {
    const depotsData = await getDepots();
    const vehiclesData = await getVehicles();

    console.log("Depots:", depotsData);
    console.log("Vehicles:", vehiclesData);
})();