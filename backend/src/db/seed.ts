import pool from '../db/mysql';

const seedData = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Starting dummy data seeding...');

        // 1. Insert User (Agen)
        const [userRows] = await connection.query('SELECT id FROM users WHERE email = ?', ['adipragiwaksono@gmail.com']);
        let userId;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((userRows as any[]).length === 0) {
            const [insertUser] = await connection.query(`
        INSERT INTO users 
        (first_name, last_name, email, phone, company_name, job_title, password_hash, referrer_rank, bank_account_name, bank_name, bank_account_number) 
        VALUES 
        ('Rupert', 'Alexander', 'adipragiwaksono@gmail.com', '+62 822-0870-3090', 'HAHAHA Corp', 'Head of Creative', 'hashed_password_123', 'Super Referrer', 'Rupert Alexander', 'BCA', '1400012345678')
      `);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            userId = (insertUser as any).insertId;
            console.log('Demo user created with ID:', userId);
        } else {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            userId = (userRows as any[])[0].id;
            console.log('Demo user already exists. ID:', userId);
        }

        // 2. Insert Services
        const demoServices = [
            'Nusanet Broadband Business EDGE100',
            'Nusanet Broadband Business EDGE200',
            'Nusanet Broadband Business EDGE300',
            'Nusanet Dedicated Business NOVA90',
            'Nusawork Advance',
            'Nusafiber Life',
            'Nusafiber Selecta Basic 30'
        ];

        const serviceIds: Record<string, number> = {};
        for (const sName of demoServices) {
            const [sRows] = await connection.query('SELECT id FROM services WHERE service_name = ?', [sName]);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((sRows as any[]).length === 0) {
                const [insertS] = await connection.query('INSERT INTO services (service_name) VALUES (?)', [sName]);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                serviceIds[sName] = (insertS as any).insertId;
            } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                serviceIds[sName] = (sRows as any[])[0].id;
            }
        }
        console.log('Demo services checked/created.');

        // 3. Insert Customers
        const demoCustomers = [
            { ref_id: 'CUST-001', pic: 'Chalista', biz: 'PT Alpha', email: 'chalista@email.com', phone: '+62811111111' },
            { ref_id: 'CUST-002', pic: 'Kurtney', biz: 'PT Beta', email: 'kurtney@email.com', phone: '+62822222222' },
            { ref_id: 'CUST-003', pic: 'Budi', biz: 'CV Maju Jaya', email: 'budi@email.com', phone: '+62833333333' },
            { ref_id: 'CUST-004', pic: 'Anita', biz: 'Toko Segar', email: 'anita@email.com', phone: '+62844444444' }
        ];

        const customerIds: number[] = [];
        for (const c of demoCustomers) {
            const [cRows] = await connection.query('SELECT id FROM customers WHERE customer_ref_id = ?', [c.ref_id]);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if ((cRows as any[]).length === 0) {
                const [insertC] = await connection.query(`
          INSERT INTO customers (referrer_id, customer_ref_id, pic_name, business_name, emails, phones, am_name, activation_date) 
          VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        `, [userId, c.ref_id, c.pic, c.biz, JSON.stringify([c.email]), JSON.stringify([c.phone]), 'Account Manager 1']);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                customerIds.push((insertC as any).insertId);
            } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                customerIds.push((cRows as any[])[0].id);
            }
        }
        console.log('Demo customers checked/created.');

        // 4. Insert Points Ledger
        const [pRows] = await connection.query('SELECT COUNT(*) as count FROM points_ledger WHERE referrer_id = ?', [userId]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((pRows as any[])[0].count === 0) {
            // Create transactions across the last few months for the chart
            const pointsData = [
                // Month 1 (Jan)
                { cIdx: 0, sName: 'Nusanet Broadband Business EDGE100', points: 300, date: '2026-01-07 10:00:00' },
                { cIdx: 1, sName: 'Nusanet Broadband Business EDGE200', points: 145, date: '2026-01-05 14:00:00' },
                // Month 12 Prev Year (Dec)
                { cIdx: 2, sName: 'Nusawork Advance', points: 129, date: '2025-12-11 09:00:00' },
                { cIdx: 3, sName: 'Nusawork Advance', points: 329, date: '2025-12-11 11:30:00' },
                { cIdx: 0, sName: 'Nusafiber Life', points: 6732, date: '2025-12-06 08:00:00' },
                { cIdx: 1, sName: 'Nusafiber Selecta Basic 30', points: 193, date: '2025-12-05 16:20:00' },
                // Random previous months points to fill the chart
                { cIdx: 2, sName: 'Nusawork Advance', points: 8000, date: '2025-09-11 09:00:00' },
                { cIdx: 3, sName: 'Nusafiber Life', points: 5000, date: '2025-05-11 09:00:00' }
            ];

            for (const pd of pointsData) {
                await connection.query(`
               INSERT INTO points_ledger (referrer_id, customer_id, service_id, points_awarded, status, transaction_date)
               VALUES (?, ?, ?, ?, 'MASUK', ?)
            `, [userId, customerIds[pd.cIdx], serviceIds[pd.sName], pd.points, pd.date]);
            }
            console.log('Demo point transactions created.');
        } else {
            console.log('Point transactions already exist, skipping.');
        }

        console.log('✅ Demo data seeding completed successfully!');
        connection.release();
        process.exit(0);

    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
