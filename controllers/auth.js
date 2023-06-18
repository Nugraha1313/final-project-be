const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("../utils/nodemailer");
// const imagekit = require("../utils/imageKit");
const oauth2 = require("../utils/oauth2");
const validator = require("validator");
const fastestValidator = require("fastest-validator");
const v = new fastestValidator();
// const phones = require("phone");
// const detectPhonenumber = require("detect-phonenumber");
let otpGenerator = require("otp-generator");
const { Users } = require("../db/models");
const { JWT_SECRET_KEY, API_HOST, FE_HOST } = process.env;
// Function to Compares dates (expiration time and current time in our case)
var dates = {
  convert: function (d) {
    // Converts the date in d to a date-object. The input can be:
    //   a date object: returned without modification
    //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
    //   a number     : Interpreted as number of milliseconds
    //                  since 1 Jan 1970 (a timestamp)
    //   a string     : Any format supported by the javascript engine, like
    //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
    //  an object     : Interpreted as an object with year, month and date
    //                  attributes.  **NOTE** month is 0-11.
    return d.constructor === Date
      ? d
      : d.constructor === Array
      ? new Date(d[0], d[1], d[2])
      : d.constructor === Number
      ? new Date(d)
      : d.constructor === String
      ? new Date(d)
      : typeof d === "object"
      ? new Date(d.year, d.month, d.date)
      : NaN;
  },
  compare: function (a, b) {
    // Compare two dates (could be of any type supported by the convert
    // function above) and returns:
    //  -1 : if a < b
    //   0 : if a = b
    //   1 : if a > b
    // NaN : if a or b is an illegal date
    return isFinite((a = this.convert(a).valueOf())) &&
      isFinite((b = this.convert(b).valueOf()))
      ? (a > b) - (a < b)
      : NaN;
  },
  inRange: function (d, start, end) {
    // Checks if date in d is between dates in start and end.
    // Returns a boolean or NaN:
    //    true  : if d is between start and end (inclusive)
    //    false : if d is before start or after end
    //    NaN   : if one or more of the dates is illegal.
    return isFinite((d = this.convert(d).valueOf())) &&
      isFinite((start = this.convert(start).valueOf())) &&
      isFinite((end = this.convert(end).valueOf()))
      ? start <= d && d <= end
      : NaN;
  },
};

module.exports = {
  register: async (req, res) => {
    try {
      const { name, email, phone_number, password, confirmPassword } = req.body;
      if (!name) {
        return res.status(400).json({
          status: false,
          message: "Name is required!",
          data: null,
        });
      }

      if (!email) {
        return res.status(400).json({
          status: false,
          message: "Email is required!",
          data: null,
        });
      }

      if (!phone_number) {
        return res.status(400).json({
          status: false,
          message: "Phone Number is required!",
          data: null,
        });
      }

      if (!password) {
        return res.status(400).json({
          status: false,
          message: "Password is required!",
          data: null,
        });
      }

      if (!confirmPassword) {
        return res.status(400).json({
          status: false,
          message: "Confirm Password is required!",
          data: null,
        });
      }

      //   find user by email
      const findUser = await Users.findOne({ where: { email } });

      //   if email is already used
      if (findUser) {
        return res.status(400).json({
          status: false,
          message: "Email is already used!",
          data: null,
        });
      }
      // validator the phone number should number
      // const validatorNumber = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
      const validatorNumber = new RegExp("^[0-9]+$");
      const is_valid_number = validatorNumber.test(phone_number);
      console.log("PHONE_NUMBER : ", phone_number);
      if (
        !is_valid_number ||
        phone_number.length < 10 ||
        phone_number.length > 13
      ) {
        return res.status(400).json({
          status: false,
          message: "Phone Number is not valid",
          data: null,
        });
      }

      //   validator is it email or not
      if (!validator.isEmail(email)) {
        return res.status(400).json({
          status: false,
          message: "Email is not valid",
          data: null,
        });
      }

      // check is password is strong or not using regular expression (regex)
      const strongPassword = new RegExp(
        "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})"
      );
      const check = strongPassword.test(password);
      //   if password is not strong
      if (!check) {
        return res.status(400).json({
          status: false,
          message:
            "Password minimum 6 characters, must contain uppercase, lowercase, and number!",
        });
      }

      if (password != confirmPassword) {
        return res.status(400).json({
          status: false,
          message: "password and confirm password doesn\t match!!!",
        });
      }

      //   if (findUser && findUser.is_google_account == true) {
      //     return res.status(400).json({
      //       status: false,
      //       message: "Email is already used!, Please login using google",
      //       data: null,
      //     });
      //   }

      // To add minutes to the current time
      function AddMinutesToDate(date, minutes) {
        return new Date(date.getTime() + minutes * 60000);
      }
      //   OTP
      //Generate OTP
      const otp = otpGenerator.generate(6, {
        alphabets: false,
        upperCase: false,
        specialChars: false,
      });
      const now = new Date();
      //   set to 1 minutes
      const otp_expiration_time = AddMinutesToDate(now, 1);
      // console.log("KODE OTP : ", otp);
      // console.log("EXPIRED : ", otp_expiration_time);
      //  hashing password
      const hashPassword = await bcrypt.hash(password, 10);

      //   add user
      const newUser = await Users.create({
        name,
        email,
        phone_number,
        password: hashPassword,
        otp,
        otp_expiration_time,
      });

      const payload = {
        id: newUser.id,
      };

      const token = await jwt.sign(payload, JWT_SECRET_KEY);

      const url = `${req.protocol}://${req.get(
        "host"
      )}/auth/send-otp?token=${token}`;

      const html = await nodemailer.getHtml("send-otp.ejs", {
        otp,
      });

      nodemailer.sendMail(newUser.email, "[TRIPP] OTP Verification", html);

      return res.status(201).json({
        status: true,
        message:
          "OTP has been sent, expired in 1 minutes, please check your email!",
        data: null,
      });
    } catch (err) {
      throw err;
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      //   sebelum login pastikan email ini sudah aktif apa belum, kalo belum redirect untuk send-otp

      if (!email) {
        return res.status(400).json({
          status: false,
          message: "Field email is required!",
          data: null,
        });
      }

      if (!password) {
        return res.status(400).json({
          status: false,
          message: "Field password is required!",
          data: null,
        });
      }

      if (!validator.isEmail(email)) {
        return res.status(400).json({
          status: false,
          message: "Email is not valid",
          data: null,
        });
      }

      const findUser = await Users.findOne({ where: { email } });
      //   user with email given not found
      if (!findUser) {
        return res.status(400).json({
          status: false,
          message: "Email is not registered!, please register first!",
          data: null,
        });
      }
      // check password
      const checkPassword = await bcrypt.compare(password, findUser.password);

      if (!checkPassword) {
        return res.status(400).json({
          status: false,
          message: "Password is incorrect",
          data: null,
        });
      }
      // user is found but not verified
      if (findUser && findUser.is_verified == false) {
        return res.status(401).json({
          status: false,
          message:
            "Account is not activated, please check your email, and verify the otp!",
          data: null,
        });
      }

      const payload = {
        id: findUser.id,
        role: findUser.role,
      };

      const token = await jwt.sign(payload, JWT_SECRET_KEY, {
        expiresIn: "1d",
      });
      return res.status(200).json({
        status: true,
        message: "Login success!",
        data: {
          token: token,
        },
      });
    } catch (err) {
      throw err;
    }
  },
    loginGoogle: async (req, res) => {
      try {
        const { code } = req.query;
        if (!code) {
          const googleLoginUrl = oauth2.generateAuthUrl();
          return res.redirect(googleLoginUrl);
        }

        await oauth2.setCreadentials(code);
        const { data } = await oauth2.getUserData();

        let user = await Users.findOne({
          where: { email: data.email },
        });
        if (!user) {
          user = await Users.create({
            name: data.name,
            email: data.email,
            is_verified: true,
            user_type: 'google',
          });
        } else {
          await Users.update(
            { is_verified: true, user_type:'google' },
            { where: { email: data.email } }
          );
        }

        const payload = {
          id: user.id,
          role: user.role,
        };

        const token = await jwt.sign(payload, JWT_SECRET_KEY);

        return res.status(200).json({
          status: true,
          message: "login success!",
          data: {
            token: token,
          },
        });
      } catch (err) {
        throw err;
      }
    },
  resendOTP: async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: false,
        message: "Email is required!",
        data: null,
      });
    }

    //   validator is it email or not
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        status: false,
        message: "Email is not valid",
        data: null,
      });
    }

    //   find user by email
    const findUser = await Users.findOne({ where: { email } });

    //   if email is not registered => email not found
    if (!findUser) {
      return res.status(400).json({
        status: false,
        message: "Email is not registered!",
        data: null,
      });
    }
    // validate if user is already request resend otp => to limit request
    const now = new Date();
    if (findUser.otp != null && findUser.otp_expiration_time != null) {
      // console.log("=========================================");
      // console.log("NOW : ", now);
      // console.log("EXPIRED : ", findUser.otp_expiration_time);
      // console.log("=========================================");
      // not expired
      // console.log(
      //   "HASIL PERBADNINGAN : ",
      //   dates.compare(findUser.otp_expiration_time, now)
      // );
      if (dates.compare(findUser.otp_expiration_time, now) == 1) {
        return res.status(400).json({
          status: false,
          message:
            "You have already requested resend otp, check your email please",
          data: null,
        });
      }
    }

    // To add minutes to the current time
    function AddMinutesToDate(date, minutes) {
      return new Date(date.getTime() + minutes * 60000);
    }
    //   OTP
    //Generate OTP
    const generatedOTP = otpGenerator.generate(6, {
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });
    //   set to 1 minutes
    const otp_expiration_time = AddMinutesToDate(now, 1);
    console.log("KODE OTP : ", generatedOTP);
    console.log("EXPIRED : ", otp_expiration_time);

    const updatedUser = await Users.update(
      { otp: generatedOTP, otp_expiration_time: otp_expiration_time },
      { where: { email } }
    );
    if (updatedUser[0] == 0) {
      return res.status(400).json({
        status: false,
        message: "Failed Send the OTP!",
        data: null,
      });
    }

    const html = await nodemailer.getHtml("send-otp.ejs", {
      otp: generatedOTP,
    });

    nodemailer.sendMail(email, "[TRIPP] OTP Verification", html);

    return res.status(201).json({
      status: true,
      message:
        "OTP has been sent, expired in 10 minutes, please check your email!",
      data: null,
    });
  },
  verifyOTP: async (req, res) => {
    try {
      // token menandakan user sudah login
      //   const { token } = req.query;
      const { email, otp } = req.body;

      if (!email) {
        return res.status(400).json({
          status: false,
          message: "Email is required!",
          data: null,
        });
      }

      if (!otp) {
        return res.status(400).json({
          status: false,
          message: "OTP is required!",
          data: null,
        });
      }

      const currentDate = new Date();
      const user = await Users.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({
          status: false,
          message: "Email is not registered!",
          data: null,
        });
      }
      //   if is user trying verified otp but not sent the request
      if (user.otp == null && user.otp_expiration_time == null) {
        return res.status(400).json({
          status: false,
          message: "You're Not Request OTP Yet!",
          data: null,
        });
      }
      //   if account is already verified
      if (user.is_verified == true) {
        // check if OTP is expired or not
        console.log("OTP EXP : ", user.otp_expiration_time);
        console.log("CURRENT Date : ", currentDate);
        console.log(
          "HASIL PERBANDINGAN DGN NOW : ",
          dates.compare(user.otp_expiration_time, currentDate)
        );
        if (dates.compare(user.otp_expiration_time, currentDate) == 1) {
          // check if OTP is same with the DB
          if (otp == user.otp) {
            const updatedUser = await Users.update(
              { otp: null, otp_expiration_time: null },
              { where: { email } }
            );
            if (updatedUser[0] == 0) {
              return res.status(400).json({
                status: false,
                message: "Failed Verified The OTP!",
                data: null,
              });
            }

            return res.status(200).json({
              status: true,
              message: "Success Verified The OTP!",
              data: null,
            });
          } else {
            return res.status(400).json({
              status: false,
              message: "OTP is Not Valid!",
            });
          }
        } else {
          return res.status(400).json({
            status: false,
            message: "OTP is expired!",
          });
        }
      }

      if (
        user.is_verified == false &&
        user.otp != null &&
        user.otp_expiration_time != null
      ) {
        // check if OTP is expired or not
        console.log("OTP EXP : ", user.otp_expiration_time);
        console.log("CURRENT Date : ", currentDate);
        if (dates.compare(user.otp_expiration_time, currentDate) == 1) {
          // check if OTP is same with the DB
          if (otp == user.otp) {
            // mark otp as verified => is_otp_verified = true
            // check if account is verified or not
            //   if (user.is_account_verified == false) {
            //     // update is_verified =
            //     const data = await jwt.verify(token, JWT_SECRET_KEY);
            //     const updatedUser = await Users.update(
            //       { otp: null,
            //         is_otp
            //         ,is_account_verified: true },
            //       { where: { id: data.id } }
            //     );
            //     if (updatedUser[0] == 0) {
            //       return res.status(400).json({
            //         status: true,
            //         message: "Activation account failed!",
            //         data: null,
            //       });
            //     }

            //     return res.status(200).json({
            //       status: true,
            //       message: "Activation account success!",
            //       data: null,
            //     });
            //   }
            // then delete the otp

            //   const data = await jwt.verify(token, JWT_SECRET_KEY);
            const updatedUser = await Users.update(
              { otp: null, otp_expiration_time: null, is_verified: true },
              { where: { email } }
            );
            if (updatedUser[0] == 0) {
              return res.status(400).json({
                status: false,
                message: "Activation account failed!",
                data: null,
              });
            }

            return res.status(200).json({
              status: true,
              message: "Activation account success!",
              data: null,
            });
          } else {
            return res.status(400).json({
              status: false,
              message: "OTP is Not Valid!",
            });
          }
        } else {
          return res.status(400).json({
            status: false,
            message: "OTP is expired!",
          });
        }
      }
    } catch (error) {
      throw error;
    }
  },
  resetPassword: async (req, res, next) => {
    try {
      const { newPassword, confirmPassword } = req.body;
      const { token } = req.query;

      if (!token) {
        return res.status(400).json({
          status: false,
          message: "invalid token!",
        });
      }

      let strongPassword = new RegExp(
        "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})"
      );

      let check = strongPassword.test(newPassword);
      if (!check)
        return res.status(400).json({
          status: false,
          message:
            "Password min 6 character, include a minimum of 1 lower case letter [a-z], a minimum of 1 upper case letter [A-Z] , and a minimum of 1 numeric character [0-9]",
        });

      if (newPassword != confirmPassword) {
        return res.status(400).json({
          status: false,
          message: "password and confirm password doesn't match",
        });
      }

      const payload = jwt.verify(token, JWT_SECRET_KEY);

      const encryptedPassword = await bcrypt.hash(newPassword, 10);

      const user = await Users.update(
        { password: encryptedPassword },
        { where: { id: payload.id } }
      );

      if (user) {
        return res.status(200).json({
          status: true,
          message: "Success update password!",
        });
      }
    } catch (err) {
      next(err);
    }
  },

  forgotPassword: async (req, res, next) => {
    try {
      const { email } = req.body;

      const user = await Users.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({
          status: false,
          message: "email not found!",
        });
      } else {
        const payload = { id: user.id };
        const token = jwt.sign(payload, JWT_SECRET_KEY);
        const link = `${FE_HOST}/reset-password?token=${token}`;
        const html = await nodemailer.getHtml("reset-password.ejs", {
          name: user.name,
          link: link,
        });
        // await nodemailer.sendEmail(user.email, "Reset your password", htmlEmail);
        nodemailer.sendMail(email, "[TRIPP] Reset Password", html);
      }
      return res.status(200).json({
        success: true,
        message: "Success send link reset password to your email!",
      });
    } catch (err) {
      next(err);
    }
  },
};
