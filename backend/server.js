import express from 'express';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import { initDB, isDBConnected } from './db.js';
import { requireAuth } from './middleware/authMiddleware.js';
import { initializeDemoAccount } from './services/demoService.js';

import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import userRoutes from './routes/userRoutes.js';
import shopRoutes from './routes/shopRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';
import focusRoutes from './routes/focusRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL;
const isProduction = process.env.NODE_ENV === 'production';

// Trust reverse proxy in production (Render HTTPS termination)
app.set('trust proxy', 1);

// 1. CORS Middleware (strict in production, permissive in local dev)
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, mobile apps, health checkers)
      if (!origin) return callback(null, true);

      // Local development origins
      if (!isProduction) {
        if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
          return callback(null, true);
        }
      }

      // Production configured CLIENT_URL
      if (CLIENT_URL) {
        const normalizedClient = CLIENT_URL.replace(/\/$/, '');
        if (origin === normalizedClient || origin.startsWith(normalizedClient)) {
          return callback(null, true);
        }
      }

      if (!isProduction) {
        return callback(null, true);
      }

      return callback(new Error(`[CORS Policy] Origin ${origin} is not authorized.`));
    },
    credentials: true,
  })
);

// 2. Request Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Session Middleware (Render production HTTPS secure cookie with sameSite none)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'nexaura_cyber_secret_0x89A_upgrade_your_reality',
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      secure: isProduction, // HTTPS secure cookie on Render
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: isProduction ? 'none' : 'lax', // 'none' required for cross-domain HTTPS cookies on Render
    },
  })
);

// 4. API Routes (Prefixed with /api)
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', requireAuth, taskRoutes);
app.use('/api/user', requireAuth, userRoutes);
app.use('/api/shop', requireAuth, shopRoutes);
app.use('/api/achievements', requireAuth, achievementRoutes);
app.use('/api/focus', requireAuth, focusRoutes);

// Compatibility aliases (for direct route access)
app.use('/health', healthRoutes);
app.use('/auth', authRoutes);
app.use('/tasks', requireAuth, taskRoutes);
app.use('/user', requireAuth, userRoutes);
app.use('/shop', requireAuth, shopRoutes);
app.use('/achievements', requireAuth, achievementRoutes);
app.use('/focus', requireAuth, focusRoutes);

// 5. Root status
app.get('/', (req, res) => {
  res.json({
    name: 'Nexaura.exe Core Server',
    tagline: 'Upgrade Your Reality',
    status: 'ONLINE',
    database: isDBConnected(),
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      tasks: '/api/tasks',
      user: '/api/user',
      shop: '/api/shop',
      achievements: '/api/achievements',
      focus: '/api/focus',
    },
  });
});

// 6. Unknown Route Handler (404)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Terminal directive not found: ${req.method} ${req.originalUrl}`,
  });
});

// 7. Global Error Handler (500)
app.use((err, req, res, next) => {
  console.error('[Nexaura Server Fault]:', err);
  res.status(500).json({
    success: false,
    message: 'Internal neural processing fault.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 8. Server Boot
async function startServer() {
  console.log('⚡ Initializing Nexaura.exe Core Engine...');
  await initDB();
  await initializeDemoAccount();

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Nexaura.exe backend daemon active at: http://localhost:${PORT}`);
    console.log(`🔌 Health check available at: http://localhost:${PORT}/api/health`);
  });
}

startServer();

export default app;
