'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('passenger_types', [
      {
        name: "dewasa",
        description: "paid",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "anak",
        description: "paid",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "bayi",
        description: "free",
        created_at: new Date(),
        updated_at: new Date(),
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('passenger_types', null, {})
  }
};
