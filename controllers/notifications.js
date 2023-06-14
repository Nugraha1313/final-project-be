const {Notification} = require('../db/models');

module.exports = {

    getAllNotificationsByUserId : async (req, res) => {
        try {
          const { id } = req.params;
      
          const notifications = await Notification.findAll({ where: { user_id: id } });
          return res.status(200).json({
            status: true,
            message: 'success',
            data: notifications
          });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal Server Error' });
        }
      },
      
    index: async (req, res) => {
        try {
            const notifications = await Notification.findAll({where: {user_id: req.user.id}});

            return res.status(200).json({
                status: true,
                message: 'success',
                data: notifications
            });
        } catch (err) {
            throw err;
        }
    },

    readNotif: async (req, res) => {
        try {
            const {id} = req.params;
            await Notification.update({is_read: true}, {where: {id, user_id: req.user.id}});

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


