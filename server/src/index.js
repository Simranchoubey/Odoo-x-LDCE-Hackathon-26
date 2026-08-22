import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import citiesRoutes from './routes/cities.js';
import activitiesRoutes from './routes/activities.js';
import tripsRoutes from './routes/trips.js';
import publicRoutes from './routes/public.js';
import adminRoutes from './routes/admin.js';
import { requireAuth } from './middleware/auth.js';
import { errorHandler, notFound } from './middleware/error.js';

const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? true : ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', requireAuth, usersRoutes);
app.use('/api/cities', citiesRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/trips', requireAuth, tripsRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/admin', adminRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../../dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return notFound(req, res);
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running. Frontend is running on a separate port in dev mode.');
  });
}

app.use('/api', notFound);
app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`GlobeTrotter API listening on http://localhost:${port}`));
