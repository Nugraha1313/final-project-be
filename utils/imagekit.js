
var ImageKit = require('imagekit');

const {
    IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_SECRET_KEY,
    IMAGEKIT_URL_ENDPOINT
} = process.env;

module.exports = new ImageKit({
    publicKey: IMAGEKIT_PUBLIC_KEY,
    privateKey: IMAGEKIT_SECRET_KEY,
    urlEndpoint: IMAGEKIT_URL_ENDPOINT
});