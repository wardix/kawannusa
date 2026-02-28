import { Hono } from 'hono';
import pool from '../db/mysql';

const products = new Hono();

products.use('/*', async (c, next) => {
    c.set('userId', 1);
    await next();
});

// GET /api/products/summary
products.get('/summary', async (c) => {
    const userId = c.get('userId');
    try {
        const [rows] = await pool.query(`
      SELECT 
        s.service_name as name, 
        MAX(p.transaction_date) as last_ref_date,
        SUM(p.points_awarded) as total_points,
        COUNT(DISTINCT p.customer_id) as total_customers
      FROM points_ledger p
      JOIN services s ON p.service_id = s.id
      WHERE p.referrer_id = ?
      GROUP BY s.id, s.service_name
    `, [userId]);

        return c.json({ products: rows });
    } catch (error) {
        return c.json({ error: 'Database error' }, 500);
    }
});

export { products };
