'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    const airlinesRaw = require('./data/airlines.json');
    const airlines = airlinesRaw.map(airline => {
      return {
        ...airline,
        created_at: new Date(),
        updated_at: new Date()
      };
    });

    await queryInterface.bulkInsert('airlines', airlines, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('airlines', null, {});
  }
};
