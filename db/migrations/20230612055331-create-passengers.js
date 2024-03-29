'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('passengers', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      date_of_birth: {
        type: Sequelize.STRING
      },
      nationality: {
        type: Sequelize.STRING
      },
      ktp: {
        type: Sequelize.STRING
      },
      passport: {
        type: Sequelize.STRING
      },
      issuing_country: {
        type: Sequelize.STRING
      },
      expiration_date: {
        type: Sequelize.STRING
      },
      passenger_type_id: {
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
    await queryInterface.dropTable('passengers');
  }
};