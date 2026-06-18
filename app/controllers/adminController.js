const Admin = require('../models/Admin');
const logger = require('../config/logger');

exports.listeAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll();
    res.json({ success: true, data: admins });
  } catch (error) {
    logger.error('Erreur listeAdmins:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ 
        success: false, 
        message: 'Administrateur non trouvé' 
      });
    }
    res.json({ success: true, data: admin });
  } catch (error) {
    logger.error('Erreur getAdminById:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

exports.updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.update(req.params.id, req.body);
    if (!admin) {
      return res.status(404).json({ 
        success: false, 
        message: 'Administrateur non trouvé' 
      });
    }
    res.json({ success: true, data: admin });
  } catch (error) {
    logger.error('Erreur updateAdmin:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

exports.toggleAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ 
        success: false, 
        message: 'Administrateur non trouvé' 
      });
    }
    
    const updated = await Admin.update(id, { actif: !admin.actif });
    res.json({ 
      success: true, 
      data: updated,
      message: `Administrateur ${updated.actif ? 'activé' : 'désactivé'} avec succès`
    });
  } catch (error) {
    logger.error('Erreur toggleAdmin:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const result = await Admin.delete(req.params.id);
    if (!result) {
      return res.status(404).json({ 
        success: false, 
        message: 'Administrateur non trouvé' 
      });
    }
    res.json({ 
      success: true, 
      message: 'Administrateur supprimé avec succès' 
    });
  } catch (error) {
    logger.error('Erreur deleteAdmin:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const admin = req.admin;
    res.json({ success: true, data: admin });
  } catch (error) {
    logger.error('Erreur getProfile:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};