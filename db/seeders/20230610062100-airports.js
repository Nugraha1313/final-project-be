'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    const airportsRaw = require('./data/airports.json');
    const airports = airportsRaw.map(airport => {
      return {
        ...airport,
        created_at: new Date(),
        updated_at: new Date()
      };
    });

    await queryInterface.bulkInsert('airports', airports, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('airports', null, {});
  }
};
