const pgp = require('pg-promise')();
const config= require('../config/config.js');
const  db = pgp(config.config);
db.connect();
module.exports.db = db;
