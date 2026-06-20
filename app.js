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

// Fait confiance au proxy de Render pour récupérer la vraie IP du client
// (nécessaire pour que express-rate-limit fonctionne correctement)
app.set('trust proxy', 1);

// ============ MIDDLEWARES GLOBAUX ============

// Sécurité
app.use(helmet());

// CORS
// CORS
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : '*';

console.log('CORS_ORIGIN brut:', JSON.stringify(process.env.CORS_ORIGIN));
console.log('Origines autorisées (après trim):', allowedOrigins);

app.use(cors({
  origin: (origin, callback) => {
    console.log('Origin reçue dans une requête:', JSON.stringify(origin));
    if (!origin || allowedOrigins === '*' || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ Origine refusée:', JSON.stringify(origin));
      callback(new Error('Not allowed by CORS'));
    }
  },
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