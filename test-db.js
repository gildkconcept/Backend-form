const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'cdg_db',
  user: 'cdg_user',
  password: 'CDG@Db2026!',
});

async function test() {
  try {
    console.log('🔍 Test de connexion à PostgreSQL local...');
    const result = await pool.query('SELECT NOW() as current_time');
    console.log('✅ Connexion réussie !');
    console.log('📅 Heure du serveur:', result.rows[0].current_time);
    
    // Vérifier les admins
    const admins = await pool.query('SELECT id, username, email, role FROM administrateurs');
    console.log('👤 Administrateurs:', admins.rows);
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
  }
}

test();