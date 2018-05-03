const mongooose = require('mongoose');

mongooose.connect(process.env.MONGODB_CONNECTION_STRING);
const db = mongooose.connection;

db.on('error', () => {
  console.log('DB connection eror');
});
db.on('open', () => {
  console.log('connected to db');
});

module.exports = db;
