const mysql2 = require ('mysql2/promise');
const dotenv = require ('dotenv');
const { connect } = require('../app');

dotenv.config();

const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});

const connectDB = async() => {
    try {
        const connection = await pool.getConnection();
        console.log('MYSQL connected Successfully');
        connection.release();
    } catch (error) {
        console.error('MySQL Connection Error', error.message);
        process.exit(1);
    };
};

module.exports = {pool, connectDB};