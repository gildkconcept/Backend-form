const pool = require('../config/database');
const logger = require('../config/logger');

async function generateReference() {
  try {
    const year = new Date().getFullYear();
    
    const query = `
      SELECT COUNT(*) as count 
      FROM partenaires 
      WHERE reference LIKE $1
    `;
    const result = await pool.query(query, [`CDG-${year}-%`]);
    const count = parseInt(result.rows[0].count) + 1;
    
    const reference = `CDG-${year}-${String(count).padStart(6, '0')}`;
    return reference;
  } catch (error) {
    logger.error('Erreur generateReference:', error);
    throw error;
  }
}

module.exports = generateReference;