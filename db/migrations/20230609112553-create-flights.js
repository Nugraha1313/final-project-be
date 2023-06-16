'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('flights', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      flight_number: {
        type: Sequelize.STRING
      },
      departure_airport_id: {
        type: Sequelize.INTEGER
      },
      airplane_id: {
        type: Sequelize.INTEGER
      },
      airline_id: {
        type: Sequelize.INTEGER
      },
      arrival_airport_id: {
        type: Sequelize.INTEGER
      },
      class: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.INTEGER
      },
      departure_terminal_name: {
        type: Sequelize.STRING
      },
      arrival_terminal_name: {
        type: Sequelize.STRING
      },
      flight_date: {
        type: Sequelize.STRING
      },
      departure_time: {
        type: Sequelize.STRING
      },
      arrival_time: {
        type: Sequelize.STRING
      },
      flight_duration: {
        type: Sequelize.INTEGER
      },
      departure_timestamp: {
        type: Sequelize.INTEGER
      },
      arrival_timestamp: {
        type: Sequelize.INTEGER
      },
      free_baggage: {
        type: Sequelize.INTEGER
      },
      cabin_baggage: {
        type: Sequelize.INTEGER
      },
      capacity: {
        type: Sequelize.INTEGER
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('flights');
  }
};