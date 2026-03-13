require('dotenv').config();
const request = require('supertest');
const app = require('../src/app');
const mysql2 = require('mysql2/promise');

jest.mock('../src/services/emailService', () => ({
    sendVerificationEmail: jest.fn().mockResolvedValue(true)
}));

let pool;
let authToken;

beforeAll(async () => {
    pool = await mysql2.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        charset: 'utf8mb4'
    });
});

beforeEach(async () => {
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    await pool.query('DELETE FROM transactions');
    await pool.query('DELETE FROM categories');
    await pool.query('DELETE FROM users');
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');

    // Register and verify user to get token
    await request(app).post('/api/auth/register').send({
        fullName: 'Yahya Dumba',
        email: 'yahyadumba63@gmail.com',
        password: 'SecurePass123!'
    });

    // Manually verify user in DB
    await pool.query(
        'UPDATE users SET isVerified = TRUE WHERE email = ?',
        ['yahyadumba63@gmail.com']
    );

    // Login to get token
    const loginRes = await request(app).post('/api/auth/login').send({
        email: 'yahyadumba63@gmail.com',
        password: 'SecurePass123!'
    });

    authToken = loginRes.body.data.token;
});

afterAll(async () => {
    await pool.end();
});

describe('POST /api/transactions', () => {
    it('should create a transaction successfully', async () => {
        const res = await request(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                type: 'expense',
                amount: 100,
                transactionDate: '2026-03-13',
                description: 'Groceries'
            });
        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
    });

    it('should reject transaction without token', async () => {
        const res = await request(app)
            .post('/api/transactions')
            .send({
                type: 'expense',
                amount: 100,
                transactionDate: '2026-03-13'
            });
        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    });

    it('should reject invalid transaction type', async () => {
        const res = await request(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                type: 'invalid',
                amount: 100,
                transactionDate: '2026-03-13'
            });
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it('should reject amount less than or equal to 0', async () => {
        const res = await request(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                type: 'expense',
                amount: -50,
                transactionDate: '2026-03-13'
            });
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });
});

describe('GET /api/transactions', () => {
    it('should fetch transactions successfully', async () => {
        const res = await request(app)
            .get('/api/transactions')
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('should reject without token', async () => {
        const res = await request(app).get('/api/transactions');
        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    });
});

describe('DELETE /api/transactions/:id', () => {
    it('should delete a transaction successfully', async () => {
        // First create a transaction
        const createRes = await request(app)
            .post('/api/transactions')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                type: 'expense',
                amount: 100,
                transactionDate: '2026-03-13'
            });

        const transactionId = createRes.body.data.transactionId;

        const res = await request(app)
            .delete(`/api/transactions/${transactionId}`)
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it('should return 404 for non-existing transaction', async () => {
        const res = await request(app)
            .delete('/api/transactions/99999')
            .set('Authorization', `Bearer ${authToken}`);
        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
    });
});