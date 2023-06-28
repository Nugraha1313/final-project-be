const imagekit = require('./imagekit');
const qr = require('qr-image');

module.exports = (text, ecLevel = 'M') => {
    return new Promise(async (resolve, reject) => {
        try {
            const qrBuffer = await qr.imageSync(text, ecLevel);
            const qrString = qrBuffer.toString('base64');

            const qrFile = await imagekit.upload({
                fileName: text,
                file: qrString
            });

            resolve(qrFile.url);

        } catch (err) {
            reject(err);
        }
    });

};