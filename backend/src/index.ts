import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { dbInit } from './db/mysql';
import { auth, profile } from './routes/auth';
import { points } from './routes/points';
import { products } from './routes/products';
import { customers } from './routes/customers';
import { webhook } from './routes/webhook';
import dashboard from './routes/dashboard';

const app = new Hono();

app.use('*', logger());
app.use('/api/*', cors());

app.get('/', (c) => {
    return c.text('Referral Portal API is running!');
});

// Setup Sub-Routes
app.route('/api/auth', auth);
app.route('/api/user/profile', profile);
app.route('/api/points', points);
app.route('/api/products', products);
app.route('/api/customers', customers);
app.route('/api/webhook', webhook);
app.route('/api/dashboard', dashboard);

// Initialize DB structure when server starts
dbInit().catch(console.error);

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
console.log(`Server is running on port ${port}`);

serve({
    fetch: app.fetch,
    port
});
