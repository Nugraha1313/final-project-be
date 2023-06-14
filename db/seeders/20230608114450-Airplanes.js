"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Airplanes",
      [
        {
          name: "Boeing 737",
          baggage: 25,
          cabin_baggage: 7,
          total_seats: 150,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Airbus A320",
          baggage: 30,
          cabin_baggage: 7,
          total_seats: 180,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Boeing 777",
          baggage: 35,
          cabin_baggage: 10,
          total_seats: 300,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Airbus A350",
          baggage: 40,
          cabin_baggage: 10,
          total_seats: 250,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Embraer E190",
          baggage: 20,
          cabin_baggage: 5,
          total_seats: 100,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Bombardier CRJ900",
          baggage: 20,
          cabin_baggage: 5,
          total_seats: 90,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Boeing 787",
          baggage: 35,
          cabin_baggage: 10,
          total_seats: 200,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Airbus A330",
          baggage: 40,
          cabin_baggage: 10,
          total_seats: 280,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "ATR 72",
          baggage: 15,
          cabin_baggage: 5,
          total_seats: 70,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Boeing 747",
          baggage: 40,
          cabin_baggage: 10,
          total_seats: 400,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Airplanes", null, {});
  },
};