const { Notifications, Users } = require('../db/models');

module.exports = {
  index : async (req, res, next) => {
    try {
      const { user_id } = req.query;

      const user = await Users.findOne({where: {id: user_id}});
      if (!user) {
        return res.status(404).json({
          status: false,
          message: `User with id ${user_id} is not found`,
          data: null
        });
      }
  
      const notifications = await Notifications.findAll({ where: { user_id } });
      if (notifications.length < 1) {
        return res.status(404).json({
          status: false,
          message: 'Notifications is still empty.',
          data: null
        });
      }

      return res.status(200).json({
        status: true,
        message: 'success',
        data: notifications
      });
    } catch (error) {
      next(error);
    }
  },
    
  show: async (req, res, next) => {
    try {
      const { id } = req.params;
      const notification = await Notifications.findOne({where: {id}});

      if (!notification) {
        return res.status(404).json({
            status: false,
            message: `Notification with id ${id} is not found`,
            data: null
        });
      }
      return res.status(200).json({
          status: true,
          message: 'success',
          data: notification
      });
    } catch (err) {
        next(err);
    }
  },

  store: async (req, res, next) => {
    try {
      const { user_id, title, description, body } = req.body;

      if (!title || !description || !body) {
        return res.status(400).json({
          status: false,
          message: 'All field are required.',
          data: null
        });
      }

      const user = await Users.findOne({where: {id: user_id}});

      if (!user) {
        return res.status(404).json({
          status: false,
          message: `User with id ${user_id} is not found.`,
          data: null
        });
      }

      const notification = await Notifications.create({ user_id: user_id, title, description, body, is_read: false });

      return res.status(200).json({
        status: true,
        message: 'success',
        data: notification
      });
    } catch (error) {
      next(error);
    }
  },

  readNotif: async (req, res) => {
    try {
        const { id } = req.params;
        await Notifications.update({is_read: true}, {where: {id}});

        return res.status(200).json({
            status: true,
            message: 'success',
            data: null
        });
    } catch (err) {
        throw err;
    }
  }
};
