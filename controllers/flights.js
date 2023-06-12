const { Op } = require("sequelize");
var Sequelize = require("sequelize");
const { Flights, Airports, Airplanes, Transactions } = require('../db/models');

module.exports = {
  // get flights by query params
  show_by_query_params: async (req, res, next) => {
    try {
      const { departure, destination, departureDate } = req.query;

      if (!departure || !destination) {
        return res.status(400). json({
          status: false,
          message: 'Departure and destination fields are required.',
          data: null
        })        
      }

      const flights = await Flights.findAll({
        // where: {departure_date: departureDate},
        attributes: ['id', 'departure_date', 'arrival_date', 'departure_time', 'arrival_time', 'available_seats', 'price'],
        include: [
          {
            model: Airports,
            as: 'flight_departure',
            attributes: ['name', 'code', 'city', 'country'],
            where: {
              city: { [Op.iLike]: departure }
            }
          },
          {
            model: Airports,
            as: 'flight_destination',
            attributes: ['name', 'code', 'city', 'country'],
            where: {
              city: { [Op.iLike]: destination }
            }
          },
          {
            model: Airplanes,
            as: 'airplane',
            attributes: ['name', 'baggage', 'cabin_baggage']
          }
        ]
      })

      if (flights.length < 1) {
        return res.status(404). json({
          status: false,
          message: 'The flight you are looking for is not available.',
          data: null
        })        
      }

      return res.status(200). json({
        status: true,
        message: 'success',
        data: flights
      })
    } catch (error) {
      next(error)
    }
  },

  show_by_Id: async (req, res, next) => {
    try {
      const { id } = req.params;

      const flight = await Flights.findAll({
        where: {id},
        attributes: ['id', 'departure_date', 'arrival_date', 'departure_time', 'arrival_time', 'available_seats', 'price'],
        include: [
          {
            model: Airports,
            attributes: ['name', 'code', 'city', 'country'],
            as: 'flight_departure'
          },
          {
            model: Airports,
            attributes: ['name', 'code', 'city', 'country'],
            as: 'flight_destination'
          },
          {
            model: Airplanes,
            as: 'airplane',
            attributes: ['name', 'baggage', 'cabin_baggage']
          }
        ]})

        // const departureTime = await flight.departure_time;
        // const arrivalTime = await flight.arrival_time;
        // const duration = await flight.departure_time

        if (flight.length < 1) {
          return res.status(404). json({
            status: false,
            message: 'The flight you are looking for is not available.',
            data: null
          })        
        }
  
        return res.status(200). json({
          status: true,
          message: 'success',
          data: flight
        })
    } catch (error) {
      next(error)
    }
  },

  // get flights by most visited countries
  most_visited_city: async (req, res, next) => {
    try {
      const flights = await Transactions.findAll({
        attributes: [[Sequelize.fn('COUNT', Sequelize.col('Transactions.id')), 'total_transaction']],
        include: [
          {
            model: Flights,
            attributes: ['id'],
            as: 'flight',
            include: [
              {
                model: Airports,
                attributes: ['id', 'city', 'country'],
                as: 'flight_destination'
              },
            ]
          }
        ],
        group: ['flight.id', 'city', "flight->flight_destination.id"]
      })

      if (flights.length < 1) {
        return res.status(404).json({
          status: false,
          message: 'No transaction data yet',
          data: flights
        })
      }

      return res.status(200).json({
        status: true,
        message: 'success',
        data: flights
      })
    } catch (error) {
      next(error)
    }
  },
}