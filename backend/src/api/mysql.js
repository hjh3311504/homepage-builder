const mysql = require('mysql2/promise');
const { mySqlOptions } = require('./serverOptions');

const pool = mysql.createPool(mySqlOptions);

module.exports = pool;
