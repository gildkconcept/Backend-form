const rateLimit = require('express-rate-limit');

// Limiteur général
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: 'Trop de requêtes, veuillez réessayer plus tard.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiteur pour l'inscription
const inscriptionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 50,
  message: {
    success: false,
    message: 'Trop d\'inscriptions, veuillez réessayer plus tard.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiteur pour l'authentification
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    success: false,
    message: 'Trop de tentatives de connexion, veuillez réessayer dans 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  inscriptionLimiter,
  authLimiter
};