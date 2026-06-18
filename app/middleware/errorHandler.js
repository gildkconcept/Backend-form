const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  logger.error(`Erreur: ${err.message}`);
  logger.error(`Stack: ${err.stack}`);

  // Erreurs de validation
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Erreur de validation',
      errors: err.errors
    });
  }

  // Erreurs de base de données
  if (err.code === '23505') {
    return res.status(400).json({
      success: false,
      message: 'Cette valeur existe déjà dans la base de données.'
    });
  }

  if (err.code === '23503') {
    return res.status(400).json({
      success: false,
      message: 'Référence invalide vers une autre ressource.'
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Une erreur interne est survenue.';

  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;