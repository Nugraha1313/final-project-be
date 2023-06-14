const { google } = require("googleapis");

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI } =
  process.env;

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI
);

module.exports = {
  oauth2Client: oauth2Client,
  generateAuthUrl: () => {
    const scopes = [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ];

    return oauth2Client.generateAuthUrl({
      access_type: "offline",
      response_type: "code",
      scope: scopes,
    });
  },

  setCreadentials: (code) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        return resolve(tokens);
      } catch (err) {
        return reject(err);
      }
    });
  },

  getUserData: () => {
    return new Promise(async (resolve, reject) => {
      try {
        const oauth2 = google.oauth2({
          auth: oauth2Client,
          version: "v2",
        });

        oauth2.userinfo.get((err, res) => {
          if (err) {
            return reject(er);
          } else {
            return resolve(res);
          }
        });
      } catch (err) {
        return reject(err);
      }
    });
  },
};
