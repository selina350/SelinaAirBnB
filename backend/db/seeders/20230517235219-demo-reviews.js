"use strict";
let options = {};
const { Op } = require("sequelize");
const { User, Spot } = require("../models");
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
const demoReviews = [
  {
    userId: 1,
    spotId: 5,
    review: "awesome",
    stars: 5,
  },
  {
    userId: 1,
    spotId: 3,
    review: "average",
    stars: 3,
  },
  {
    userId: 2,
    spotId: 3,
    review: "not clean",
    stars: 1,
  },
  {
    userId: 3,
    spotId: 1,
    review: "pretty good",
    stars: 5,
  },
  {
    userId: 3,
    spotId: 2,
    review: "Love it",
    stars: 5,
  },
  {
    userId: 4,
    spotId: 1,
    review: "pretty good",
    stars: 5,
  },
  {
    userId: 5,
    spotId: 2,
    review: "Nice",
    stars: 4,
  },
];
const users = {
  1: {
    email: "demo@user.io",
    username: "Demo-lition",
  },
  2: {
    email: "user2@user.io",
    username: "FakeUser2",
  },
  3: {
    email: "user3@user.io",
    username: "FakeUser3",
  },
  4: {
    email: "user4@user.io",
    username: "FakeUser4",
  },
  5: {
    email: "user5@user.io",
    username: "FakeUser5",
  },
};
const spots = {
  1: {
    //onwer:1
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
    //onwer:1
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
  3: {
    //onwer:2
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
  4: {
    //onwer:2
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

  5: {
    //onwer:3
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
};
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Reviews";
    for (let i = 0; i < demoReviews.length; i++) {
      const review = demoReviews[i];
      const username = users[review.userId].username;
      const spot = spots[review.spotId];
      const user = await User.findOne({ where: { username } });
      const spotInDb = await Spot.findOne({ where: spot });
      review.userId = user.id;
      review.spotId = spotInDb.id;
    }

    return queryInterface.bulkInsert(options, demoReviews, {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Reviews";
    return queryInterface.bulkDelete(options, {}, {});
  },
};
