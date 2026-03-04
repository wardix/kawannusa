import { Hono } from 'hono';
import { RowDataPacket } from 'mysql2';
import pool from '../db/mysql';

const app = new Hono();

app.get('/summary', async (c) => {
    try {
        const userId = 1; // Explicitly simulated current user ID

        // Total Pelanggan Aktif
        const [customersResult] = await pool.query<RowDataPacket[]>(
            `SELECT COUNT(*) as total_customers FROM customers WHERE referrer_user_id = ? AND status = 'Aktif'`,
            [userId]
        );
        const totalCustomers = customersResult[0]?.total_customers || 0;

        // Total Poin Aktif
        const [pointsResult] = await pool.query<RowDataPacket[]>(
            `SELECT SUM(points_awarded) as total_active FROM points_ledger WHERE user_id = ? AND status = 'MASUK'`,
            [userId]
        );
        const totalActivePoints = pointsResult[0]?.total_active || 0;

        // Layanan Direferensikan
        const [servicesResult] = await pool.query<RowDataPacket[]>(
            `SELECT COUNT(DISTINCT service_id) as total_services FROM customers WHERE referrer_user_id = ?`,
            [userId]
        );
        const totalServices = servicesResult[0]?.total_services || 0;

        // Chart Data (Mock trend)
        const chartData = [
            { name: 'Jan 1', value: 33 },
            { name: 'Jan 5', value: 43 },
            { name: 'Jan 10', value: 26 },
            { name: 'Jan 15', value: 19 },
            { name: 'Jan 20', value: 36 },
            { name: 'Jan 25', value: 33 },
            { name: 'Jan 30', value: 48 },
        ];

        // Layanan Teratas
        const [topServicesResult] = await pool.query<RowDataPacket[]>(
            `SELECT 
          s.name, 
          COUNT(c.id) as customers, 
          COALESCE(SUM(pl.points_awarded), 0) as points 
       FROM services s
       LEFT JOIN customers c ON c.service_id = s.id AND c.referrer_user_id = ?
       LEFT JOIN points_ledger pl ON pl.customer_id = c.id AND pl.status = 'MASUK'
       GROUP BY s.id
       ORDER BY points DESC
       LIMIT 5`,
            [userId]
        );

        // Pelanggan Terbaru
        const [recentCustomersResult] = await pool.query<RowDataPacket[]>(
            `SELECT 
          customer_ref_id as id,
          activation_date as regDate,
          DATE_ADD(activation_date, INTERVAL 1 YEAR) as payDate,
          CONCAT(DATE_FORMAT(activation_date, '%d/%m/%Y'), ' - ', DATE_FORMAT(DATE_ADD(activation_date, INTERVAL 1 YEAR), '%d/%m/%Y')) as period,
          status,
          am_name as am
       FROM customers 
       WHERE referrer_user_id = ? 
       ORDER BY activation_date DESC 
       LIMIT 5`,
            [userId]
        );

        const formattedRecentCustomers = recentCustomersResult.map(c => ({
            ...c,
            regDate: new Date(c.regDate).toLocaleDateString('id-ID'),
            payDate: new Date(c.payDate).toLocaleDateString('id-ID'),
        }));

        return c.json({
            metrics: {
                totalCustomers,
                totalActivePoints,
                totalServices
            },
            chartData,
            topServices: topServicesResult.map((s, index) => ({ rank: index + 1, ...s })),
            recentCustomers: formattedRecentCustomers
        });

    } catch (error) {
        console.error('Error fetching dashboard summary:', error);
        return c.json({ error: 'Failed to fetch dashboard summary' }, 500);
    }
});

export default app;
