"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "airports",
      [
        {
          code: "CGK",
          name: "Soekarno-Hatta International Airport",
          city: "Jakarta",
          country: "Indonesia",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          code: "DPS",
          name: "Ngurah Rai International Airport",
          city: "Denpasar",
          country: "Indonesia",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          code: "SUB",
          name: "Juanda International Airport",
          city: "Surabaya",
          country: "Indonesia",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          code: "BDO",
          name: "Husein Sastranegara International Airport",
          city: "Bandung",
          country: "Indonesia",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          code: "KNO",
          name: "Kualanamu International Airport",
          city: "Medan",
          country: "Indonesia",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          code: "JOG",
          name: "Adisutjipto International Airport",
          city: "Yogyakarta",
          country: "Indonesia",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          code: "SRG",
          name: "Achmad Yani International Airport",
          city: "Semarang",
          country: "Indonesia",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          code: "PNK",
          name: "Supadio International Airport",
          city: "Pontianak",
          country: "Indonesia",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          code: "UPG",
          name: "Sultan Hasanuddin International Airport",
          city: "Makassar",
          country: "Indonesia",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          code: "KUL",
          name: "Kuala Lumpur International Airport",
          city: "Kuala Lumpur",
          country: "Malaysia",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("airports", null, {});
  },
};