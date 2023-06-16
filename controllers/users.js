const { Users } = require('../db/models');

module.exports = {
  show: async (req, res, next) => {
    try {
      const { id } = req.params;

      const user = await Users.findOne({where: {id}});

      if(!user) {
        return res.status(404).json({
          status: false,
          message: 'user not found',
          data: null
        })
      }

      return res.status(200).json({
        status: true,
        message: 'success',
        data: user
      })
    } catch (error) {
      next(error)
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await Users.findOne({where: {id}});
      const { name, phone_number, email } = req.body;

      if (!user) {
        return res.status(404).json({
          status: false,
          message: 'user not found',
          data: null
        });
      }

      const updated = await Users.update({name, email, phone_number}, {where: {id}})
      
      if (updated[0] == 0) {
        return res.status(400).json({
          status: false,
          message: 'failed to update',
          data: null
        })
      }

      return res.status(200).json({
        status: true,
        message: 'success',
        data: updated
      })
    } catch (error) {
      next(error)
    }
  }
}