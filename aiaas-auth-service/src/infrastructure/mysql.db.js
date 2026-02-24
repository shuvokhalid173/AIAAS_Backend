const { db } = require('../configs/env.config');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: db.host,
    port: db.port,
    user: db.username,
    password: db.password,
    database: db.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log('MySQL connection pool created');
module.exports = pool;