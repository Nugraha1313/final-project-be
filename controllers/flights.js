var Sequelize = require("sequelize");
const {sequelize, queryTypes} = require('../external/postgres');
const Validator = require('fastest-validator');
const v = new Validator;
const { Flights, Airports, Airplanes, Airlines, Transactions } = require('../db/models');

module.exports = {
  search: async (req, res) => {
    try {
        const rules = {
            origin_airport: 'string|min:3|max:3',
            destination_airport: 'string|min:3|max:3',
            flight_date: 'string',
            passenger_cnt: 'number'
        };

        let {sort_by, sort_order} = req.query;
        if (!sort_by) sort_by = 'departure_time';
        if (!sort_order) sort_order = 'asc';

        const validateError = v.validate(req.body, rules);
        if (validateError.length) {
            return res.status(400).json({
                status: true,
                message: 'Bad Request',
                err: validateError,
                data: null
            });
        }

        const { origin_airport, destination_airport, flight_date, passenger_cnt } = req.body;
        let query = `
          WITH purchased_ticket AS (
            select flight_id, count(flight_id) as count from transactions
            left join detail_transaction
              on transactions.id = detail_transaction.transaction_id
            left join tickets
              on detail_transaction.id = tickets.detail_transaction_id
            group by flight_id
          )
          select
            flights.id,
            flights.flight_number,
            departure_airport.name as departure_airport,
            departure_airport.iata_code as departure_code,
            departure_airport.city as departure_city,
            departure_airport.country as departure_country,
            arrival_airport.name as arrival_airport,
            arrival_airport.iata_code as arrival_code,
            arrival_airport.city as arrival_city,
            arrival_airport.country as arrival_country,
            airplanes.model as airplane_model,
            airplanes.code as airplane_code,
            airlines.name as airline,
            airlines.iata_code as airline_code,
            flights.class,
            flights.price,
            flights.departure_terminal_name,
            flights.arrival_terminal_name,
            flights.flight_date,
            flights.departure_time,
            flights.arrival_time,
            flights.departure_timestamp,
            flights.arrival_timestamp,  
            flights.flight_duration,
            flights.free_baggage,
            flights.cabin_baggage,
            flights.capacity,
            purchased_ticket.count as purchased_ticket,
            flights.capacity - COALESCE(purchased_ticket.count, 0) as available_ticket
          from
            flights
            inner join airports as departure_airport on departure_airport.id = flights.departure_airport_id
            inner join airports as arrival_airport on arrival_airport.id = flights.arrival_airport_id
            inner join airplanes on airplanes.id = flights.airplane_id
            inner join airlines on airlines.id = flights.airline_id
            left join purchased_ticket on purchased_ticket.flight_id = flights.id
          where
            flights.flight_date = '${flight_date}'
            and departure_airport.iata_code = '${origin_airport}'
            and arrival_airport.iata_code = '${destination_airport}'
            and flights.capacity - COALESCE(purchased_ticket.count, 0) >= ${passenger_cnt}`;
          if (sort_by == 'departure_time') query += ` ORDER BY flights.departure_timestamp ${sort_order}`;
          if (sort_by == 'price') query += ` ORDER BY flights.price ${sort_order}`;

        const results = await sequelize.query(query, {type: queryTypes.SELECT});
        const filghts = results.map(result => {
            return result;
        });

        return res.status(200).json({
            status: true,
            message: 'OK',
            err: null,
            data: filghts
        });
    } catch (err) {
        throw err;
    }
  },

  show_by_Id: async (req, res, next) => {
    try {
      const { id } = req.params;

      const flight = await Flights.findOne({
        where: {id},
        attributes: ['id', 'flight_number', 'class', 'price', 'departure_terminal_name', 'arrival_terminal_name', 'flight_date', 'departure_time', 'arrival_time', 'flight_duration', 'free_baggage', 'cabin_baggage', 'capacity'],
        include: [
          {
            model: Airports,
            attributes: ['name', 'iata_code', 'city', 'country'],
            as: 'departure'
          },
          {
            model: Airports,
            attributes: ['name', 'iata_code', 'city', 'country'],
            as: 'arrival'
          },
          {
            model: Airlines,
            attributes: ['name', 'short_name', 'iata_code', 'icon_url'],
            as: 'airline'
          },
          {
            model: Airplanes,
            attributes: ['model', 'code', 'airline_code','seat_type'],
            as: 'airplane'
          }
        ]
      })

      if (!flight) {
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

  // get flights by most visited city
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
                as: 'arrival'
              },
            ]
          }
        ],
        group: ['flight.id', 'city', "flight->arrival.id"],
        limit: 10,
        order: [['total_transaction', 'DESC']]
      })

      if (flights.length < 1) {
        return res.status(404).json({
          status: false,
          message: 'Transaction data is still empty.',
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