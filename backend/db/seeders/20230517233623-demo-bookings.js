"use strict";
const { Op } = require("sequelize");
const { User, Spot } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
const demoBookings = [
  {
    spotId: 1,
    userId: 5,
    startDate: "2023-12-19",
    endDate: "2023-12-20",
  },
  {
    spotId: 1,
    userId: 3,
    startDate: "2023-11-23",
    endDate: "2023-11-24",
  },
  {
    spotId: 2,
    userId: 3,
    startDate: "2023-07-30",
    endDate: "2023-08-03",
  },
];
const users = {
  5: { email: "user5@user.io", username: "FakeUser5" },
  3: { email: "user3@user.io", username: "FakeUser3" },
};
const spots = {
  1: {
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
  2: {
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
};
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Bookings";
    for (let i = 0; i < demoBookings.length; i++) {
      const booking = demoBookings[i];
      const username = users[booking.userId].username;
      const spot = spots[booking.spotId];
      const user = await User.findOne({ where: { username } });
      const spotInDb = await Spot.findOne({ where: spot });
      booking.userId = user.id;
      booking.spotId = spotInDb.id;
    }
    return queryInterface.bulkInsert(options, demoBookings, {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Bookings";
    return queryInterface.bulkDelete(options, {}, {});
  },
};
