const { Transactions, Detail_transaction, Passengers, Flights, Payments, Users } = require('../db/models');
const {sequelize, queryTypes} = require('../external/postgres');

module.exports = {
  show: async (req, res, next) => {
    try {
      const { user_id } = req.params;

      let query = `
        SELECT 
          user_id, transaction_id, transactions.created_at as transaction_date, flight_number, class, price, departure_terminal_name, arrival_terminal_name, flight_date, departure_time, arrival_time, flight_duration, free_baggage, cabin_baggage, amount as total_bill, is_complete as payment_status, departure_airport.name as departure_airport, departure_airport.iata_code as departure_code, departure_airport.city as departure_city, departure_airport.country as departure_country, arrival_airport.name as arrival_airport, arrival_airport.iata_code as arrival_code, arrival_airport.city as arrival_city, arrival_airport.country as arrival_country, airplanes.model as airplane_model, airplanes.code as airplane_code, airlines.name as airline, airlines.iata_code as airline_code
        FROM transactions
          JOIN flights ON transactions.flight_id = flights.id
          JOIN users ON transactions.user_id = users.id
          JOIN payments ON transactions.id = payments.transaction_id
          JOIN airports as departure_airport ON departure_airport.id = flights.departure_airport_id
          JOIN airports as arrival_airport ON arrival_airport.id = flights.arrival_airport_id
          JOIN airplanes ON airplanes.id = flights.airplane_id
          JOIN airlines ON airlines.id = flights.airline_id
        WHERE users.id = ${user_id}
        ORDER BY transactions.id DESC
      `;

      const transactions = await sequelize.query(query, {type: queryTypes.SELECT});

      if (transactions.length < 1) {
        return res.status(404).json({
          status: false,
          message: `Transactions not found.`,
          data: transactions
        })
      }

      return res.status(200).json({
        status: true,
        message: "success",
        data: transactions
      })
    } catch (error) {
      next(error)
    }
  },

  // (POST) transaction
  store: async (req, res, next) => {
    try {
      const {user_id, flight_id, passengers} = req.body;

      if (!user_id || !flight_id || passengers.length < 1) {
        return res.status(400).json({
          status: false,
          message: 'user_id, flight_id, and passengers data are required.',
          data: null
        })
      }

      if (typeof passengers != 'object') {
        return res.status(400).json({
          status: false,
          message: 'passengers data type must be an array of object.',
          data: null
        })
      }

      const user = await Users.findOne({where: {id: user_id}});
      if (!user) {
        return res.status(404).json({
          status: false,
          message: `User with id ${user_id} is not found.`,
          data: null
        })
      }

      const flight = await Flights.findOne({where: {id: flight_id}});
      if (!flight) {
        return res.status(404).json({
          status: false,
          message: 'The flight you are looking for is not available.',
          data: null
        })
      }

      const price = flight.price;

      passengers.forEach((passenger) => {
        const {name, ktp, passport, issuing_country, date_of_birth, nationality, passenger_type} = passenger;

        if ((!ktp && !passport) || !name || !date_of_birth || !nationality || !passenger_type) {
          return res.status(404).json({
            status: false,
            message: 'Bad request.',
            data: null
          })
        }

        if (passport && !issuing_country) {
          return res.status(404).json({
            status: false,
            message: 'issuing_country field is required.',
            data: null
          })
        }
      })

      const transaction = await Transactions.create({user_id, flight_id})
      let amount = 0;

      passengers.forEach( async (passenger) => {
        let passenger_type;

        switch (passenger.passenger_type) {
          case 'dewasa':
            passenger_type = 1;
            amount += price;
            break;
          case 'anak':
            passenger_type = 2;
            amount += price;
            break;
          case 'bayi':
            passenger_type = 3;
            break;
          default:
            passenger_type = 1;
            break;
        }

        const data = await Passengers.create({
          name: passenger.name,
          date_of_birth: passenger.date_of_birth,
          nationality: passenger.nationality,
          ktp: passenger.ktp,
          passport: passenger.passport,
          issuing_country: passenger.issuing_country,
          expiration_date: passenger.expiration_date,
          passenger_type_id: passenger_type
        })

        const detail_transaksi = await Detail_transaction.create({transaction_id: transaction.id, passenger_id: data.id})
      });
      
      const payment = await Payments.create({transaction_id: transaction.id, amount, is_complete: false})
      
      return res.status(400).json({
        status: true,
        message: 'success',
        data: {
          transaction,
          passengers,
          total_price: amount
        }
      })
    } catch (error) {
      next(error)
    }
  }
}