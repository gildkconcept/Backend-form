const { verifyToken } = require('../config/auth');
const Admin = require('../models/Admin');
const logger = require('../config/logger');

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Accès non autorisé. Token manquant.' 
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token invalide ou expiré.' 
      });
    }

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: 'Administrateur non trouvé.' 
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    logger.error('Erreur auth middleware:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Erreur d\'authentification.' 
    });
  }
};

const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ 
        success: false, 
        message: 'Non authentifié.' 
      });
    }
    
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Accès non autorisé. Rôle insuffisant.' 
      });
    }
    next();
  };
};

module.exports = { auth, checkRole };