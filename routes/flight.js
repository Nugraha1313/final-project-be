const express = require("express");
const router = express.Router();
const flights = require("../controllers/flights");

router.get("/data", flights.query_data);
router.post("", flights.search);
router.get("/favorite-city", flights.most_visited_city);
router.get("/:id", flights.show_by_Id);

module.exports = router;
