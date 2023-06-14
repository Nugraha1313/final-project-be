const {Notification} = require('../db/models');

module.exports = {
    sendNotif: (notifs) => {
        try {
            notifs.forEach(async notif => {
                await Notification.create({
                    title: notif.title,
                    description: notif.description,
                    user_id: notif.user_id,
                    body: notif.body,
                    is_read: false
                });
            });
        } catch (err) {
            throw err;
        }
    }
};