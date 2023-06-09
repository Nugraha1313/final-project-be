const data = require("../");
const fs = require("fs");

module.exports = {
  // CRUD for Transaction
  indexTransactions: (req, res, next) => {
    try {
      return res.status(200).json({
        message: "success",
        data: data.transactions,
      });
    } catch (error) {
      next(err);
    }
  },

  showTransaction: (req, res, next) => {
    try {
      const { transaction_id } = req.params;

      let filteredTransaction = data.transactions.filter(
        (transaction) => transaction.id == transaction_id
      );

      if (filteredTransaction.length == 0) {
        return res.status(404).json({
          message: `Transaction with id ${transaction_id} does not exist`,
        });
      }

      return res.status(200).json({
        message: "success",
        data: filteredTransaction[0],
      });
    } catch (error) {
      next(error);
    }
  },

  storeTransaction: (req, res, next) => {
    try {
      let newTransaction = {
        id: data.next_transaction_id++,
        user_id: req.body.user_id,
        ticket_id: req.body.ticket_id,
        quantity: req.body.quantity,
      };

      data.transactions.push(newTransaction);

      fs.writeFileSync("./db/data.json", JSON.stringify(data, null, "\t"));

      return res.status(201).json({
        message: "Transaction created!",
        data: newTransaction,
      });
    } catch (error) {
      next(error);
    }
  },

  updateTransaction: (req, res, next) => {
    try {
      const { transaction_id } = req.params;
      const { user_id, ticket_id, quantity } = req.body;

      const index = data.transactions.findIndex(
        (transaction) => transaction.id == transaction_id
      );
      if (index < 0) {
        return res.status(404).json({
          message: `Transaction with id ${transaction_id} does not exist`,
        });
      }

      if (user_id) {
        data.transactions[index].user_id = user_id;
      }
      if (ticket_id) {
        data.transactions[index].ticket_id = ticket_id;
      }
      if (quantity) {
        data.transactions[index].quantity = quantity;
      }

      fs.writeFileSync("./db/data.json", JSON.stringify(data, null, "\t"));

      return res.status(200).json({
        message: "success",
        data: data.transactions[index],
      });
    } catch (error) {
      next(error);
    }
  },

  destroyTransaction: (req, res, next) => {
    try {
      const { transaction_id } = req.params;

      const index = data.transactions.findIndex(
        (transaction) => transaction.id == transaction_id
      );
      if (index < 0) {
        return res.status(404).json({
          message: `Transaction with id ${transaction_id} does not exist`,
        });
      }

      data.transactions.splice(index, 1);

      return res.status(200).json({
        message: "success",
        data: data.transactions,
      });
    } catch (error) {
      next(error);
    }
  },
};
