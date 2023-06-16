'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    const airplanesRaw = require('./data/airplanes.json');
    const airplanes = airplanesRaw.map(airplane => {
      return {
        ...airplane,
        created_at: new Date(),
        updated_at: new Date()
      };
    });

    await queryInterface.bulkInsert('airplanes', airplanes, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('airplanes', null, {});
  }
};
