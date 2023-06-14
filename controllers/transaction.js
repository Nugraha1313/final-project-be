const { Transactions, Detail_transaction, Passengers } = require('../db/models');

module.exports = {
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
          message: 'passengers data type must be an object.',
          data: null
        })
      }

      // create data : transaksi, detail_transaksi, passengers
      const transaction = await Transactions.create({user_id, flight_id})

      // create transaction dengan user_id dan flight_id dengan tanggal yang sama sebaiknya gagal dicreate
      // mengurangi jumlah kursi pada tabel flights

      passengers.forEach( async (passenger) => {
        const data = await Passengers.create({
          name: passenger.name,
          date_of_birth: passenger.date_of_birth,
          nationality: passenger.nationality,
          ktp: passenger.ktp,
          passport: passenger.passport,
          passenger_type_id: passenger.passenger_type_id == 'adult'? 1 : 2,
        })

        const detail_transaksi = await Detail_transaction.create({transaction_id: transaction.id, passenger_id: data.id})
        console.log(`CREATE PASSENGERS: ${JSON.stringify(detail_transaksi)}`)
      });
      
      return res.status(400).json({
        status: true,
        message: 'success',
        data: {
          transaction,
          passengers
        }
      })
    } catch (error) {
      next(error)
    }
  }
}