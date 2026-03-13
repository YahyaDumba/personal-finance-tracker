require('dotenv').config();
const request = require('supertest');
const app = require('../src/app');
const mysql2 = require('mysql2/promise');

jest.mock('../src/services/emailService', () => ({
  sendVerificationEmail: jest.fn().mockResolvedValue(true)
}));

let pool;
let authToken;
let categoryId;

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
  await pool.query('DELETE FROM budgets');
  await pool.query('DELETE FROM transactions');
  await pool.query('DELETE FROM categories');
  await pool.query('DELETE FROM users');
  await pool.query('SET FOREIGN_KEY_CHECKS = 1');

  // Register user
  await request(app).post('/api/auth/register').send({
    fullName: 'Yahya Dumba',
    email: 'yahyadumba63@gmail.com',
    password: 'SecurePass123!'
  });

  // Verify user
  await pool.query(
    'UPDATE users SET isVerified = TRUE WHERE email = ?',
    ['yahyadumba63@gmail.com']
  );

  // Login
  const loginRes = await request(app).post('/api/auth/login').send({
    email: 'yahyadumba63@gmail.com',
    password: 'SecurePass123!'
  });
  authToken = loginRes.body.data.token;

  // Get userId and create a test category
  const [users] = await pool.query(
    'SELECT id FROM users WHERE email = ?',
    ['yahyadumba63@gmail.com']
  );
  const userId = users[0].id;

  const [catResult] = await pool.query(
    'INSERT INTO categories (userId, name, type) VALUES (?, ?, ?)',
    [userId, 'Food', 'expense']
  );
  categoryId = catResult.insertId;
});

afterAll(async () => {
  await pool.end();
});

describe('POST /api/budgets', () => {
  it('should create a budget successfully', async () => {
    const res = await request(app)
      .post('/api/budgets')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        categoryId,
        monthlyLimit: 500,
        month: 3,
        year: 2026
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('should update existing budget for same month', async () => {
    // Create first
    await request(app)
      .post('/api/budgets')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ categoryId, monthlyLimit: 500, month: 3, year: 2026 });

    // Update same budget
    const res = await request(app)
      .post('/api/budgets')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ categoryId, monthlyLimit: 800, month: 3, year: 2026 });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.updated).toBe(true);
  });

  it('should reject missing fields', async () => {
    const res = await request(app)
      .post('/api/budgets')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ monthlyLimit: 500 });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should reject invalid month', async () => {
    const res = await request(app)
      .post('/api/budgets')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ categoryId, monthlyLimit: 500, month: 13, year: 2026 });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('GET /api/budgets', () => {
  it('should fetch budgets successfully', async () => {
    const res = await request(app)
      .get('/api/budgets?month=3&year=2026')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should reject without month and year', async () => {
    const res = await request(app)
      .get('/api/budgets')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('DELETE /api/budgets/:id', () => {
  it('should delete a budget successfully', async () => {
    const createRes = await request(app)
      .post('/api/budgets')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ categoryId, monthlyLimit: 500, month: 3, year: 2026 });

    const budgetId = createRes.body.data.budgetId;

    const res = await request(app)
      .delete(`/api/budgets/${budgetId}`)
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should return 404 for non-existing budget', async () => {
    const res = await request(app)
      .delete('/api/budgets/99999')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});