"use strict";
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
const demoUsers = [
  {
    firstName: "Demo1",
    lastName: "User",
    email: "demo@user.io",
    username: "Demo-lition",
    hashedPassword: bcrypt.hashSync("password1"),
  },
  {
    firstName: "Fake2",
    lastName: "User",
    email: "user2@user.io",
    username: "FakeUser2",
    hashedPassword: bcrypt.hashSync("password2"),
  },
  {
    firstName: "Fake3",
    lastName: "User",
    email: "user3@user.io",
    username: "FakeUser3",
    hashedPassword: bcrypt.hashSync("password3"),
  },
  {
    firstName: "Fake4",
    lastName: "User",
    email: "user4@user.io",
    username: "FakeUser4",
    hashedPassword: bcrypt.hashSync("password4"),
  },
  {
    firstName: "Fake5",
    lastName: "User",
    email: "user5@user.io",
    username: "FakeUser5",
    hashedPassword: bcrypt.hashSync("password5"),
  },
  {
    firstName: "Fake6",
    lastName: "User",
    email: "user6@user.io",
    username: "FakeUser6",
    hashedPassword: bcrypt.hashSync("password6"),
  },
];
module.exports = {
  up: async (queryInterface, Sequelize) => {
    options.tableName = "Users";
    return queryInterface.bulkInsert(options, demoUsers, {});
  },

  down: async (queryInterface, Sequelize) => {
    options.tableName = "Users";
    return queryInterface.bulkDelete(options, {}, {});
  },
};
