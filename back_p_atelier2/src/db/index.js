const mysql = require('mysql2/promise');
const config = require('../config/config.js');

const pool = mysql.createPool({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    connectionLimit: 10, //limite a 10 connexion simultanées.
});

async function testConnection() {
    const [rows] = await pool.query('SELECT NOW() AS now');
    console.log('co a mysql ok a, ' , rows[0].now);
}

module.exports = pool;
