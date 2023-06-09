const data = require("../");
const fs = require("fs");

module.exports = {
  // Read all users
  indexUsers: (req, res, next) => {
    try {
      return res.status(200).json({
        message: "success",
        data: data.users,
      });
    } catch (error) {
      next(err);
    }
  },

  // Read a single user by ID
  showUser: (req, res, next) => {
    try {
      const { user_id } = req.params;

      let filteredUser = data.users.filter((user) => user.id == user_id);

      if (filteredUser.length == 0) {
        return res.status(404).json({
          message: `User with id ${user_id} does not exist`,
        });
      }

      return res.status(200).json({
        message: "success",
        data: filteredUser[0],
      });
    } catch (error) {
      next(error);
    }
  },

  // Create a new user
  storeUser: (req, res, next) => {
    try {
      let newUser = {
        id: data.next_user_id++,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber,
        otp: req.body.otp,
        role: req.body.role,
        userType: req.body.userType,
        isVerified: req.body.isVerified,
        thumbnail: req.body.thumbnail,
      };

      data.users.push(newUser);

      fs.writeFileSync("./db/data.json", JSON.stringify(data, null, "\t"));

      return res.status(201).json({
        message: "User created!",
        data: newUser,
      });
    } catch (error) {
      next(error);
    }
  },

  // Update an existing user
  updateUser: (req, res, next) => {
    try {
      const { user_id } = req.params;

      const index = data.users.findIndex((user) => user.id == user_id);
      if (index < 0) {
        return res.status(404).json({
          message: `User with id ${user_id} does not exist`,
        });
      }

      const {
        name,
        email,
        password,
        phoneNumber,
        otp,
        role,
        userType,
        isVerified,
        thumbnail,
      } = req.body;

      if (name) {
        data.users[index].name = name;
      }
      if (email) {
        data.users[index].email = email;
      }
      if (password) {
        data.users[index].password = password;
      }
      if (phoneNumber) {
        data.users[index].phoneNumber = phoneNumber;
      }
      if (otp) {
        data.users[index].otp = otp;
      }
      if (role) {
        data.users[index].role = role;
      }
      if (userType) {
        data.users[index].userType = userType;
      }
      if (isVerified !== undefined) {
        data.users[index].isVerified = isVerified;
      }
      if (thumbnail) {
        data.users[index].thumbnail = thumbnail;
      }

      fs.writeFileSync("./db/data.json", JSON.stringify(data, null, "\t"));

      return res.status(200).json({
        message: "success",
        data: data.users[index],
      });
    } catch (error) {
      next(error);
    }
  },

  // Delete a user
  destroyUser: (req, res, next) => {
    try {
      const { user_id } = req.params;

      const index = data.users.findIndex((user) => user.id == user_id);
      if (index < 0) {
        return res.status(404).json({
          message: `User with id ${user_id} does not exist`,
        });
      }

      data.users.splice(index, 1);

      return res.status(200).json({
        message: "success",
        data: data.users,
      });
    } catch (error) {
      next(error);
    }
  },
};
