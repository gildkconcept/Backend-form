const pool = require('../config/database');
const logger = require('../config/logger');

exports.getDashboardStats = async (req, res) => {
  try {
    const query = `
      SELECT 
        COUNT(*) as total_partenaires,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '30 days' THEN 1 END) as nouveaux_30j,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) as nouveaux_7j,
        COUNT(CASE WHEN statut = 'Nouveau' THEN 1 END) as statut_nouveau,
        COUNT(CASE WHEN statut = 'Contacté' THEN 1 END) as statut_contacte,
        COUNT(CASE WHEN statut = 'Actif' THEN 1 END) as statut_actif,
        COUNT(CASE WHEN statut = 'Partenaire stratégique' THEN 1 END) as statut_strategique,
        COUNT(CASE WHEN statut = 'Suspendu' THEN 1 END) as statut_suspendu,
        COUNT(CASE WHEN statut = 'Archivé' THEN 1 END) as statut_archive
      FROM partenaires
    `;
    const result = await pool.query(query);
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    logger.error('Erreur getDashboardStats:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

exports.getPartenairesStats = async (req, res) => {
  try {
    const query = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM partenaires
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `;
    const result = await pool.query(query);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    logger.error('Erreur getPartenairesStats:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

exports.getFormulesStats = async (req, res) => {
  try {
    const query = `
      SELECT 
        formule,
        COUNT(*) as count
      FROM partenaires
      GROUP BY formule
      ORDER BY count DESC
    `;
    const result = await pool.query(query);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    logger.error('Erreur getFormulesStats:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

exports.getTypesStats = async (req, res) => {
  try {
    const query = `
      SELECT 
        type_donateur,
        COUNT(*) as count
      FROM partenaires
      GROUP BY type_donateur
      ORDER BY count DESC
    `;
    const result = await pool.query(query);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    logger.error('Erreur getTypesStats:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

exports.getPaysStats = async (req, res) => {
  try {
    const query = `
      SELECT 
        pays,
        COUNT(*) as count
      FROM partenaires
      GROUP BY pays
      ORDER BY count DESC
      LIMIT 10
    `;
    const result = await pool.query(query);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    logger.error('Erreur getPaysStats:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

exports.getStatutsStats = async (req, res) => {
  try {
    const query = `
      SELECT 
        statut,
        COUNT(*) as count
      FROM partenaires
      GROUP BY statut
      ORDER BY count DESC
    `;
    const result = await pool.query(query);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    logger.error('Erreur getStatutsStats:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

exports.getEvolutionStats = async (req, res) => {
  try {
    const query = `
      SELECT 
        DATE_TRUNC('month', created_at) as mois,
        COUNT(*) as count
      FROM partenaires
      WHERE created_at >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY mois DESC
    `;
    const result = await pool.query(query);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    logger.error('Erreur getEvolutionStats:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};