const mysql2 = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    charset: 'utf8mb4'
});

const connectDB = async() => {
    try {
        const connection = await pool.getConnection();
        console.log('MYSQL connected Successfully');
        connection.release();
    } catch (error) {
        console.error('MySQL Connection Error', error.message);
    };
};

module.exports = {pool, connectDB};