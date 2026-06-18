const app = require('./app');
const logger = require('./app/config/logger');
const pool = require('./app/config/database');

const PORT = process.env.PORT || 5000;

// Fonction de démarrage du serveur
async function startServer() {
  try {
    console.log('🔍 Étape 1: Test de connexion à la base de données...');
    await pool.query('SELECT NOW()');
    console.log('✅ Base de données connectée avec succès');

    console.log('🔍 Étape 2: Démarrage du serveur...');
    const server = app.listen(PORT, () => {
      console.log('=================================');
      console.log('🚀 Backend Club de la Grâce');
      console.log(`📡 Port: ${PORT}`);
      console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 URL: http://localhost:${PORT}`);
      console.log(`🏥 Health: http://localhost:${PORT}/health`);
      console.log('=================================');
      logger.info(`🚀 Serveur démarré sur le port ${PORT}`);
    });

    server.on('error', (error) => {
      console.error('❌ Erreur serveur détaillée:', error);
      console.error('❌ Stack:', error.stack);
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Le port ${PORT} est déjà utilisé`);
        process.exit(1);
      }
    });

    const shutdown = () => {
      console.log('🛑 Arrêt du serveur...');
      server.close(() => {
        console.log('✅ Serveur arrêté');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error) {
    console.error('❌ Erreur de démarrage détaillée:');
    console.error('📝 Message:', error.message);
    console.error('📚 Stack:', error.stack);
    console.error('🔍 Code:', error.code);
    process.exit(1);
  }
}

// Gestion des erreurs non capturées
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Rejection:', error);
  console.error('Stack:', error.stack);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  console.error('Stack:', error.stack);
  process.exit(1);
});

console.log('🚀 Lancement du serveur...');
startServer();