require('dotenv').config();
const request = require('supertest');
const app = require('../src/app');
const mysql2 = require('mysql2/promise')

let pool;

// Mock email service so it doesn't actually send emails during tests
jest.mock('../src/services/emailService', () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue(true)
}));

// Create pool
beforeAll(async () => {
    pool = await mysql2.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        charset: 'utf8mb4'
    })
})

//Clean up DB before each test
beforeEach(async () => {
  await pool.query('SET FOREIGN_KEY_CHECKS = 0');
  await pool.query('DELETE FROM users');
  await pool.query('SET FOREIGN_KEY_CHECKS = 1');
});

//Close DB connection after all tests
afterAll(async () => {
    await pool.end();

});

describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
        const res = await request(app).post('/api/auth/register').send({
            fullName: 'Yahya Dumba',
            email: 'yahyadumba63@gmail.com',
            password: 'SecurePass123!'
        });
        console.log('RESPONSE BODY:', res.body);
        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toContain('verification');
    });

    it('should reject duplicate emails', async () => {
        //Register for first time
        await request(app).post('/api/auth/register').send({
            fullName: 'Yahya Dumba',
            email: 'yahyadumba63@gmail.com',
            password: 'SecurePass123!'
        });

        // Register second time with same email
        const res = await request(app).post('/api/auth/register').send({
            fullName: 'Yahya Dumba',
            email: 'yahyadumba63@gmail.com',
            password: 'SecurePass123!'
        });

        expect(res.statusCode).toBe(409);
        expect(res.body.success).toBe(false);
    });

    it('should reject missing fields', async () => {
        const res = await request(app).post('/api/auth/register').send({
            email: 'yahyadumba63@gmail.com'
        })
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    })
})

describe('POST /api/auth/login', () => {
    it('should reject login for unverified emails', async () => {
        await request(app).post('/api/auth/register').send({
            fullName: 'Yahya Dumba',
            email: 'yahyadumba63@gmail.com',
            password: 'SecurePass123!'
        })

        const res = await request(app).post('/api/auth/login').send({
            email: 'yahyadumba63@gmail.com',
            password: 'SecurePass123!'
        })
        expect(res.statusCode).toBe(403);
        expect(res.body.success).toBe(false);
    })

    it('should reject wrong password', async () => {
        const res  = await request(app).post('/api/auth/login').send({
            email: 'yahyadumba63@gmail.com',
            password: 'SecurePass123!'
        })
        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    })
})
