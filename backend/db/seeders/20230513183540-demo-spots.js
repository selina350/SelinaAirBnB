"use strict";
const { Op } = require("sequelize");
const {User} = require("../models")
const demoSpots = [
  {
    username: "Demo-lition",//1
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
    username: "Demo-lition",//1
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
    username: "FakeUser2",//2
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
  {
    username: "FakeUser2",//2
    address: "address22",
    city: "city22",
    state: "California",
    country: "United States of America",
    lat: 37.764533,
    lng: -122.4730323,
    name: "App Academy",
    description: "Place where web developers are created",
    price: 150,
  },
  {
    username: "FakeUser3",//3
    address: "address3",
    city: "city3",
    state: "California",
    country: "United States of America",
    lat: 37.764533,
    lng: -122.4730323,
    name: "App Academy",
    description: "Place where web developers are created",
    price: 150,
  },
  {
    username: "FakeUser4",//4
    address: "address4",
    city: "city4",
    state: "California",
    country: "United States of America",
    lat: 37.764533,
    lng: -122.4730323,
    name: "App Academy",
    description: "Place where web developers are created",
    price: 400,
  },
  {
    username: "FakeUser5",//5
    address: "address5",
    city: "city5",
    state: "California",
    country: "United States of America",
    lat: 37.764533,
    lng: -122.4730323,
    name: "App Academy",
    description: "Place where web developers are created",
    price: 500,
  },
  {
    username: "FakeUser6",//6
    address: "address6",
    city: "city6",
    state: "California",
    country: "United States of America",
    lat: 37.764533,
    lng: -122.4730323,
    name: "App Academy",
    description: "Place where web developers are created",
    price: 600,
  },
  {
    username: "FakeUser3",//3
    address: "address33",
    city: "city33",
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
    for(let i = 0; i < demoSpots.length; i++){
      const spot = demoSpots[i];
      const user = await User.findOne({where:{username: spot.username}})
      spot.ownerId = user.id;
      delete spot.username
    }
    return queryInterface.bulkInsert(options, demoSpots, {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Spots";

    return queryInterface.bulkDelete(options, {}, {});
  },
};
