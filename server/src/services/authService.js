const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { pool } = require('../config/db');
const generateToken = require('../utils/generateToken');
const { sendVerificationEmail } = require('./emailService');

const registerUser = async (fullName, email, password) => {
    //Check if User already exists
    const [existingUser] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);

    if (existingUser.length > 0) {
        throw new Error('Email exists')
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationToken = uuidv4();

    // Insert user into DB
    const [result] = await pool.query(`INSERT INTO users (fullName, email, hashedPassword, verificationToken) VALUES (?, ?, ?, ?)`,
        [fullName, email, hashedPassword, verificationToken]);

    //Send Verification Email
    sendVerificationEmail(email, verificationToken).catch((err) => {
        console.log('Email sending failed (non-critical):', err.message);
    });
    return { userId: result.insertId };
};

const loginUser = async (email, password) => {
    //Find user by email
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?',
        [email]);
    if (users.length == 0) {
        throw new Error('Credentials are Invalid');
    }

    const user = users[0];

    // Checking if email is verified or not
    if (!user.isVerified) {
        throw new Error('Email is not Verified');
    }

    //Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

    if (!isPasswordValid) {
        throw new Error('INVALID_CREDENTIALS');
    }

    // Generate JWT token
    const token = generateToken(user.id);

    return {
        token,
        user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email
        }
    };
};

const verifyEmail = async (token) => {
  console.log('VERIFYING TOKEN:', token);

  // First check if user is already verified with this token
  const [users] = await pool.query(
    'SELECT id, isVerified FROM users WHERE verificationToken = ? OR (isVerified = TRUE AND verificationToken IS NULL)',
    [token]
  );

  console.log('USERS FOUND:', users.length);

  if (users.length === 0) {
    throw new Error('Token is Invalid');
  }

  // Update if not already verified
  if (!users[0].isVerified) {
    await pool.query(
      'UPDATE users SET isVerified = TRUE, verificationToken = NULL WHERE id = ?',
      [users[0].id]
    );
  }

  return true;
};


module.exports = { registerUser, loginUser, verifyEmail };