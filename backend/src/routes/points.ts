import { Hono } from 'hono';
import pool from '../db/mysql';

const points = new Hono();

// Middleware to mock extracting user id
points.use('/*', async (c, next) => {
    c.set('userId', 1);
    await next();
});

// GET /api/points/chart-data
points.get('/chart-data', async (c) => {
    const userId = c.get('userId');
    try {
        // Basic aggregation query (Mocking the data returned for the chart)
        const [rows] = await pool.query(`
      SELECT 
        DATE_FORMAT(transaction_date, '%b') as month, 
        SUM(points_awarded) as total 
      FROM points_ledger 
      WHERE referrer_id = ? 
      GROUP BY DATE_FORMAT(transaction_date, '%b')
    `, [userId]);

        // In reality you would format this nicely
        return c.json({ data: rows });
    } catch (error) {
        return c.json({ error: 'Database error' }, 500);
    }
});

// GET /api/points/summary
points.get('/summary', async (c) => {
    const userId = c.get('userId');
    try {
        const [rows] = await pool.query(`
      SELECT 
        SUM(CASE WHEN status = 'MASUK' THEN points_awarded ELSE 0 END) as total_active,
        SUM(CASE WHEN status = 'DITARIK' THEN points_awarded ELSE 0 END) as total_withdrawn
      FROM points_ledger 
      WHERE referrer_id = ?
    `, [userId]);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return c.json({ summary: (rows as any[])[0] });
    } catch (error) {
        return c.json({ error: 'Database error' }, 500);
    }
});

// GET /api/points/history
points.get('/history', async (c) => {
    const userId = c.get('userId');
    try {
        const [rows] = await pool.query(`
      SELECT 
        p.id, p.points_awarded, p.status, p.transaction_date,
        c.pic_name, c.customer_ref_id,
        s.service_name 
      FROM points_ledger p
      LEFT JOIN customers c ON p.customer_id = c.id
      LEFT JOIN services s ON p.service_id = s.id
      WHERE p.referrer_id = ?
      ORDER BY p.transaction_date DESC
    `, [userId]);

        return c.json({ history: rows });
    } catch (error) {
        return c.json({ error: 'Database error' }, 500);
    }
});

export { points };
