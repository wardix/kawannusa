import { Hono } from 'hono';
import pool from '../db/mysql';

const customers = new Hono();

customers.use('/*', async (c, next) => {
    c.set('userId', 1);
    await next();
});

// GET /api/customers
customers.get('/', async (c) => {
    const userId = c.get('userId');
    try {
        const [rows] = await pool.query(`
      SELECT * FROM customers WHERE referrer_id = ? ORDER BY created_at DESC
    `, [userId]);

        return c.json({ customers: rows });
    } catch (error) {
        return c.json({ error: 'Database error' }, 500);
    }
});

export { customers };
