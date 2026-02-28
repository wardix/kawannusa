import { Hono } from 'hono';
import pool from '../db/mysql';
import jwt from 'jsonwebtoken';

const auth = new Hono();

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_for_jwt';

// Quick Mock Login for Demo Purposes (creates a token for user ID 1)
auth.post('/login', async (c) => {
    const body = await c.req.json();
    const { email, password } = body;

    if (!email || !password) {
        return c.json({ error: 'Email and password required' }, 400);
    }

    // Very basic mock check. In real world we would query the DB and check hashes
    if (email === 'adipragiwaksono@gmail.com' && password === 'password') {
        const token = jwt.sign({ userId: 1 }, JWT_SECRET, { expiresIn: '1d' });
        return c.json({ token, message: 'Login successful' });
    }

    return c.json({ error: 'Invalid credentials' }, 401);
});

// Profile endpoints
const profile = new Hono();

// Middleware to mock extracting user id from JWT
profile.use('/*', async (c, next) => {
    // In a real app we'd verify the JWT
    c.set('userId', 1); // Mock authenticated user
    await next();
});

profile.get('/', async (c) => {
    const userId = c.get('userId');
    try {
        const [rows] = await pool.query('SELECT id, first_name, last_name, email, phone, company_name, job_title, avatar_url, join_date, referrer_rank, pref_updates_enabled, pref_auto_withdraw, bank_account_name, bank_name, bank_account_number FROM users WHERE id = ?', [userId]);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const user = (rows as any[])[0];

        if (!user) {
            return c.json({ error: 'User not found' }, 404);
        }

        return c.json({ user });
    } catch (error) {
        return c.json({ error: 'Database error' }, 500);
    }
});

profile.put('/', async (c) => {
    const userId = c.get('userId');
    const body = await c.req.json();

    try {
        const updateFields = [];
        const values = [];

        // Dynamically build update query based on provided fields
        const allowedFields = ['first_name', 'last_name', 'email', 'phone', 'company_name', 'job_title', 'pref_updates_enabled', 'pref_auto_withdraw', 'bank_account_name', 'bank_name', 'bank_account_number'];

        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                updateFields.push(`${field} = ?`);
                values.push(body[field]);
            }
        }

        if (updateFields.length === 0) {
            return c.json({ error: 'No fields to update' }, 400);
        }

        values.push(userId);
        const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;

        await pool.query(query, values);

        return c.json({ message: 'Profile updated successfully' });
    } catch (error) {
        return c.json({ error: 'Database update failed' }, 500);
    }
});

export { auth, profile };
