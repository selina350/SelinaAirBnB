"use strict";
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Images", "imageableType", {
      type: Sequelize.ENUM({
        values: ["Spot", "Review"],
      }),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Images", "imageableType", {
      type: Sequelize.STRING,
    });
  },
};
