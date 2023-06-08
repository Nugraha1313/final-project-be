"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "routes",
      [
        {
          departure: "CGK",
          destination: "DPS",
          region: "Domestic",
          categoryId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          departure: "CGK",
          destination: "SUB",
          region: "Domestic",
          categoryId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          departure: "CGK",
          destination: "BDO",
          region: "Domestic",
          categoryId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          departure: "CGK",
          destination: "KNO",
          region: "Domestic",
          categoryId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          departure: "CGK",
          destination: "JOG",
          region: "Domestic",
          categoryId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          departure: "DPS",
          destination: "KUL",
          region: "International",
          categoryId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          departure: "DPS",
          destination: "SUB",
          region: "Domestic",
          categoryId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          departure: "DPS",
          destination: "SRG",
          region: "Domestic",
          categoryId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          departure: "DPS",
          destination: "UPG",
          region: "Domestic",
          categoryId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          departure: "SUB",
          destination: "BDO",
          region: "Domestic",
          categoryId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("routes", null, {});
  },
};
