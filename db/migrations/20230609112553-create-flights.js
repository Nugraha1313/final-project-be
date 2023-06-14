'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Flights', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      airplane_id: {
        type: Sequelize.INTEGER
      },
      departure: {
        type: Sequelize.INTEGER
      },
      destination: {
        type: Sequelize.INTEGER
      },
      departure_date: {
        type: Sequelize.DATE
      },
      arrival_date: {
        type: Sequelize.DATE
      },
      departure_time: {
        type: Sequelize.STRING
      },
      arrival_time: {
        type: Sequelize.STRING
      },
      available_seats: {
        type: Sequelize.INTEGER
      },
      price: {
        type: Sequelize.INTEGER
      },
      operation_status: {
        type: Sequelize.BOOLEAN
      },
      region_category_id: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Flights');
  }
};