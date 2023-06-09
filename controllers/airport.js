const data = require('../');
const fs = require('fs');

module.exports = {
  // CRUD for Airport
  indexAirports: (req, res, next) => {
    try {
      return res.status(200).json({
        message: "success",
        data: data.airports,
      });
    } catch (error) {
      next(err);
    }
  },

  showAirport: (req, res, next) => {
    try {
      const { airport_id } = req.params;

      let filteredAirport = data.airports.filter(
        (airport) => airport.id == airport_id
      );

      if (filteredAirport.length == 0) {
        return res.status(404).json({
          message: `Airport with id ${airport_id} does not exist`,
        });
      }

      return res.status(200).json({
        message: "success",
        data: filteredAirport[0],
      });
    } catch (error) {
      next(error);
    }
  },

  storeAirport: (req, res, next) => {
    try {
      let newAirport = {
        id: data.next_airport_id++,
        name: req.body.name,
        city: req.body.city,
        country: req.body.country,
      };

      data.airports.push(newAirport);

      fs.writeFileSync("./db/data.json", JSON.stringify(data, null, "\t"));

      return res.status(201).json({
        message: "Airport created!",
        data: newAirport,
      });
    } catch (error) {
      next(error);
    }
  },

  updateAirport: (req, res, next) => {
    try {
      const { airport_id } = req.params;
      const { name, city, country } = req.body;

      const index = data.airports.findIndex(
        (airport) => airport.id == airport_id
      );
      if (index < 0) {
        return res.status(404).json({
          message: `Airport with id ${airport_id} does not exist`,
        });
      }

      if (name) {
        data.airports[index].name = name;
      }
      if (city) {
        data.airports[index].city = city;
      }
      if (country) {
        data.airports[index].country = country;
      }

      fs.writeFileSync("./db/data.json", JSON.stringify(data, null, "\t"));

      return res.status(200).json({
        message: "success",
        data: data.airports[index],
      });
    } catch (error) {
      next(error);
    }
  },

  destroyAirport: (req, res, next) => {
    try {
      const { airport_id } = req.params;

      const index = data.airports.findIndex(
        (airport) => airport.id == airport_id
      );
      if (index < 0) {
        return res.status(404).json({
          message: `Airport with id ${airport_id} does not exist`,
        });
      }

      data.airports.splice(index, 1);

      return res.status(200).json({
        message: "success",
        data: data.airports,
      });
    } catch (error) {
      next(error);
    }
  },
};
