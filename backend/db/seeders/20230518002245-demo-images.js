"use strict";
const { Op } = require("sequelize");
const { Review, Spot } = require("../models");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
const demoImages = [
  {
    url: "https://a0.muscache.com/im/pictures/c36ddec0-9a59-4174-a615-ea79820e601e.jpg?im_w=720",
    imageableId: 1,
    imageableType: "Spot",
    preview: true,
  },
  {
    url: "https://a0.muscache.com/im/pictures/5a594695-1062-4faf-98f1-ca00707d1899.jpg?im_w=720",
    imageableId: 1,
    imageableType: "Spot",
    preview: false,
  },
  {
    url: "https://a0.muscache.com/im/pictures/62a94e3c-a0d8-4e6a-a093-44d5ec58cf4b.jpg?im_w=720",
    imageableId: 1,
    imageableType: "Spot",
    preview: false,
  },
  {
    url: "https://a0.muscache.com/im/pictures/96333af6-2bca-4d94-a516-d517ca0e5d63.jpg?im_w=1200",
    imageableId: 1,
    imageableType: "Spot",
    preview: false,
  },
  {
    url: "https://a0.muscache.com/im/pictures/ebfc63d1-7dea-419e-9cf3-0030231ba271.jpg?im_w=720",
    imageableId: 1,
    imageableType: "Spot",
    preview: false,
  },
  {
    url: "https://a0.muscache.com/im/pictures/137ebd51-b6ae-4f2b-835e-2bc6caaf908e.jpg?im_w=720",
    imageableId: 1,
    imageableType: "Review",
    preview: false,
  },
  {
    url: "image url",
    imageableId: 2,
    imageableType: "Review",
    preview: false,
  },
  {
    url: "image url",
    imageableId: 2,
    imageableType: "Spot",
    preview: true,
  },
];
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
const reviews = {
  1: {
    review: "awesome",
    stars: 5,
  },
  2: {
    review: "average",
    stars: 3,
  },
};
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Images";
    for (let i = 0; i < demoImages.length; i++) {
      const image = demoImages[i];
      if (image.imageableType === "Spot") {
        const spot = spots[image.imageableId];
        const spotInDb = await Spot.findOne({ where: spot });
        image.imageableId = spotInDb.id;
      } else {
        const review = reviews[image.imageableId];
        const reviewInDb = await Review.findOne({
          where: review,
          attributes: ["id"],
        });
        image.imageableId = reviewInDb.id;
      }
    }
    return queryInterface.bulkInsert(options, demoImages, {});
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Images";
    return queryInterface.bulkDelete(options, {}, {});
  },
};
