const DATABASE_URL = process.env.DATABASE_URL || "postgres://qgjmjrvpnooxbd:-kllbSyNCkgI7aLHRg0RxlAOjv@ec2-23-23-222-147.compute-1.amazonaws.com:5432/d5kk4m3ru0nl0c?ssl=true";
const pgp = require('pg-promise')();
const db = pgp(DATABASE_URL);
module.exports={db};
