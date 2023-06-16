const { Payments, Detail_transaction, Tickets } = require('../db/models');
const randomstring = require("randomstring");

module.exports = {
  complete: async (req, res, next) => {
    try {
      const { transaction_id } = req.body;
      
      // cek payment ada apa enggak
      const payment = await Payments.findOne({where: {transaction_id}});
      if (!payment) {
        return res.status(404).json({
          status: false,
          message: `payment data with transaction id ${transaction_id} is not found`,
          data: null
        })
      }

      // get detail transaction id
      const detail_transaction = await Detail_transaction.findAll({where: {transaction_id}});
      detail_transaction.forEach(async (transaction) => {
        // create tickets
        await Tickets.create({
          detail_transaction_id: transaction.id,
          is_active: true,
          code: randomstring.generate(12)
        })
      });

      // ubah payment jadi complete
      const update = await Payments.update({is_complete: true}, {where: {transaction_id}})

      return res.status(200).json({
        status: true,
        message: "success",
        data: update
      })
    } catch (error) {
      next(error)
    }
  }
}