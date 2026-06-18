const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

// Importer les routes
const authRoutes = require('./app/routes/authRoutes');
const partenaireRoutes = require('./app/routes/partenaireRoutes');
const adminRoutes = require('./app/routes/adminRoutes');
const statsRoutes = require('./app/routes/statsRoutes');

// Importer les middlewares
const { generalLimiter, authLimiter } = require('./app/middleware/rateLimiter');
const errorHandler = require('./app/middleware/errorHandler');
const logger = require('./app/config/logger');

// Créer l'application Express
const app = express();

// ============ MIDDLEWARES GLOBAUX ============

// Sécurité
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parsing des requêtes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Limiteur général de requêtes
app.use(generalLimiter);

// Logger des requêtes
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url} - ${req.ip}`);
  next();
});

// ============ ROUTES ============

// Route de health check (publique)
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes d'authentification
app.use('/api/auth', authLimiter, authRoutes);

// Routes des partenaires
app.use('/api/partenaires', partenaireRoutes);

// Routes des administrateurs
app.use('/api/admin', adminRoutes);

// Routes des statistiques
app.use('/api/stats', statsRoutes);

// ============ GESTION DES ERREURS ============

// Route 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
    path: req.originalUrl
  });
});

// Gestionnaire d'erreurs global
app.use(errorHandler);

// Exporter l'application
module.exports = app;