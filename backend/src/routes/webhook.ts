import { Hono } from 'hono';
import pool from '../db/mysql';

const webhook = new Hono();

// POST /api/webhook/transaction
// Expected payload from external system to award commissions/points
webhook.post('/transaction', async (c) => {
    const body = await c.req.json();

    // Example payload structure:
    // {
    //   "referrer_id": 1,
    //   "customer": {
    //     "ref_id": "CUST-1234",
    //     "name": "PT Example",
    //     "business": "Tech Industry",
    //     "email": "contact@example.com",
    //     "phone": "+6281111111"
    //   },
    //   "service": "Nusanet Broadband",
    //   "points_awarded": 1000
    // }

    const { referrer_id, customer, service, points_awarded } = body;

    if (!referrer_id || !customer || !service || !points_awarded) {
        return c.json({ error: 'Missing required payload fields' }, 400);
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Check or create service
        let serviceId;
        const [serviceRows] = await connection.query('SELECT id FROM services WHERE service_name = ?', [service]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((serviceRows as any[]).length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            serviceId = (serviceRows as any[])[0].id;
        } else {
            const [insertService] = await connection.query('INSERT INTO services (service_name) VALUES (?)', [service]);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            serviceId = (insertService as any).insertId;
        }

        // 2. Check or create customer
        let customerId;
        const [customerRows] = await connection.query('SELECT id FROM customers WHERE customer_ref_id = ? AND referrer_id = ?', [customer.ref_id, referrer_id]);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((customerRows as any[]).length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            customerId = (customerRows as any[])[0].id;
        } else {
            const [insertCustomer] = await connection.query(
                'INSERT INTO customers (referrer_id, customer_ref_id, pic_name, business_name, emails, phones, activation_date) VALUES (?, ?, ?, ?, ?, ?, NOW())',
                [referrer_id, customer.ref_id, customer.name, customer.business, JSON.stringify([customer.email]), JSON.stringify([customer.phone])]
            );
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            customerId = (insertCustomer as any).insertId;
        }

        // 3. Record Points
        await connection.query(
            'INSERT INTO points_ledger (referrer_id, customer_id, service_id, points_awarded, status) VALUES (?, ?, ?, ?, ?)',
            [referrer_id, customerId, serviceId, points_awarded, 'MASUK']
        );

        // 4. Update User total points cache (optional, but good for quick access)
        // For this design, we don't have a total_points column as we compute it, but we could add one.

        await connection.commit();
        return c.json({ message: 'Transaction recorded successfully', success: true });

    } catch (error) {
        await connection.rollback();
        return c.json({ error: 'Webhook processing failed' }, 500);
    } finally {
        connection.release();
    }
});

export { webhook };
