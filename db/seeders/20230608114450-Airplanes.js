"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "airplanes",
      [
        {
          name: "Boeing 737",
          baggage: "25 kg",
          cabinBaggage: "7 kg",
          totalSeats: 150,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Airbus A320",
          baggage: "30 kg",
          cabinBaggage: "7 kg",
          totalSeats: 180,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Boeing 777",
          baggage: "35 kg",
          cabinBaggage: "10 kg",
          totalSeats: 300,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Airbus A350",
          baggage: "40 kg",
          cabinBaggage: "10 kg",
          totalSeats: 250,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Embraer E190",
          baggage: "20 kg",
          cabinBaggage: "5 kg",
          totalSeats: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Bombardier CRJ900",
          baggage: "20 kg",
          cabinBaggage: "5 kg",
          totalSeats: 90,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Boeing 787",
          baggage: "35 kg",
          cabinBaggage: "10 kg",
          totalSeats: 200,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Airbus A330",
          baggage: "40 kg",
          cabinBaggage: "10 kg",
          totalSeats: 280,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "ATR 72",
          baggage: "15 kg",
          cabinBaggage: "5 kg",
          totalSeats: 70,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Boeing 747",
          baggage: "40 kg",
          cabinBaggage: "10 kg",
          totalSeats: 400,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("airplanes", null, {});
  },
};
