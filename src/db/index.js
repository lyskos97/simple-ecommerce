const mongooose = require('mongoose');
const { connectionString } = require('../../private/db');

mongooose.connect(connectionString);
const db = mongooose.connection;

db.on('error', () => {
  console.log('DB connection eror');
});
db.on('open', () => {
  console.log('connected to db');
});

module.exports = db;
