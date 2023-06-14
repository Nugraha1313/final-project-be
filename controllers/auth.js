const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("../utils/nodemailer");
// const imagekit = require("../utils/imageKit");
// const oauth2 = require("../utils/oauth2");
const validator = require("validator");
const { Users } = require("../db/models");
const { JWT_SECRET_KEY } = process.env;

module.exports = {
  register: async (req, res) => {
    try {
      const { name, email, password, confirmPassword } = req.body;

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

      //   if user exist
      if (findUser) {
        return res.status(400).json({
          status: false,
          message: "Email is already used!",
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

      if(password != confirmPassword) {
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

      //  hashing password
      const hashPassword = await bcrypt.hash(password, 10);

      //   add user
      const newUser = await Users.create({
        name,
        email,
        password: hashPassword,
      });

      const payload = {
        id: newUser.id,
      };

      const token = await jwt.sign(payload, JWT_SECRET_KEY);

      const url = `${req.protocol}://${req.get(
        "host"
      )}/auth/activation-email?token=${token}`;

      const html = await nodemailer.getHtml("activation-email.ejs", {
        name: newUser.name,
        url,
      });

      nodemailer.sendMail(newUser.email, "Account Activation", html);

      return res.status(201).json({
        status: true,
        message: "Email activation has been sent, please check your email!",
        data: null,
      });
    } catch (err) {
      throw err;
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

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
      if (!findUser) {
        return res.status(400).json({
          status: false,
          message: "Email is not registered!, please register first!",
          data: null,
        });
      }

      if (findUser && findUser.is_verified == false) {
        return res.status(401).json({
          status: false,
          message: "Email is not activated, please check your email!",
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
  //   loginGoogle: async (req, res) => {
  //     try {
  //       const { code } = req.query;
  //       if (!code) {
  //         const googleLoginUrl = oauth2.generateAuthUrl();
  //         return res.redirect(googleLoginUrl);
  //       }

  //       await oauth2.setCreadentials(code);
  //       const { data } = await oauth2.getUserData();

  //       let user = await User.findOne({
  //         where: { email: data.email },
  //       });
  //       if (!user) {
  //         user = await User.create({
  //           name: data.name,
  //           email: data.email,
  //           is_active: true,
  //           is_google_account: true,
  //         });
  //       } else {
  //         await User.update(
  //           { is_active: true, is_google_account:true },
  //           { where: { email: data.email } }
  //         );
  //       }

  //       const payload = {
  //         id: user.id,
  //         role: user.role,
  //       };

  //       const token = await jwt.sign(payload, JWT_SECRET_KEY);

  //       return res.status(200).json({
  //         status: true,
  //         message: "login success!",
  //         data: {
  //           token: token,
  //         },
  //       });
  //     } catch (err) {
  //       throw err;
  //     }
  //   },
  verifyEmail: async (req, res) => {
    try {
      const { token } = req.query;
      if (!token) {
        return res.status(400).json({
          status: true,
          message: "Token is invalid!",
          data: null,
        });
      }

      const data = await jwt.verify(token, JWT_SECRET_KEY);
      const verify = await Users.update(
        { is_verified: true },
        { where: { id: data.id } }
      );
      if (verify[0] == 0) {
        return res.status(400).json({
          status: true,
          message: "Activation account failed!",
          data: null,
        });
      }

      return res.status(200).json({
        status: true,
        message: "Activation account success!",
        data: null,
      });
    } catch (error) {
      throw error;
    }
  },
};
