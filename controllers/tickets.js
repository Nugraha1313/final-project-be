const { Detail_transaction } = require('../db/models');
const {sequelize, queryTypes} = require('../external/postgres');

module.exports = {
  show: async (req, res, next) => {
    try {
      const { transaction_id } = req.params;

      const detail_transaction = await Detail_transaction.findAll({where: {transaction_id}});
      
      if (!detail_transaction) {
        return res.status(404).json({
          status: false,
          message: `transaction data with transaction id ${transaction_id} is not found`,
          data: null
        })
      }

      let query = `
      SELECT transaction_id, passenger_id, name, is_active, code AS ticket_code FROM detail_transaction
        JOIN tickets ON detail_transaction.id = tickets.detail_transaction_id
        JOIN passengers ON detail_transaction.passenger_id = passengers.id
      WHERE transaction_id = ${transaction_id}
      `;

      const tickets = await sequelize.query(query, {type: queryTypes.SELECT});

      if (!tickets) {
        return res.status(404).json({
          status: false,
          message: `Tickets not found, please complete the payment!`,
          data: tickets
        })
      }

      return res.status(200).json({
        status: true,
        message: "success",
        data: tickets
      })
    } catch (error) {
      next(error)
    }
  }
}