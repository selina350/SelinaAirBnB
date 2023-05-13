"use strict";
const bcrypt = require("bcryptjs");
const demoSpots = [
  {
    ownerId: 1,
    address: "123 Disney Lane",
    city: "San Francisco",
    state: "California",
    country: "United States of America",
    lat: 37.7645358,
    lng: -122.4730327,
    name: "App Academy",
    description: "Place where web developers are created",
    price: 123,
  },
  {
    ownerId: 1,
    address: "address1",
    city: "city1",
    state: "California",
    country: "United States of America",
    lat: 37.764535,
    lng: -122.4730329,
    name: "App Academy",
    description: "Place where web developers are created",
    price: 100,
  },

  {
    ownerId: 2,
    address: "address2",
    city: "city2",
    state: "California",
    country: "United States of America",
    lat: 37.764533,
    lng: -122.4730323,
    name: "App Academy",
    description: "Place where web developers are created",
    price: 200,
  },

];
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Spots";
    return queryInterface.bulkInsert(
      options,
      demoSpots,
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Spots";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      demoSpots,
      {}
    );
  },
};
