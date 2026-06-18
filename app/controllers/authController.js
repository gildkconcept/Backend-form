const Admin = require('../models/Admin');
const { generateToken } = require('../config/auth');
const logger = require('../config/logger');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findByUsername(username);
    if (!admin) {
      logger.warn(`Tentative de connexion échouée - Utilisateur: ${username}`);
      return res.status(401).json({ 
        success: false, 
        message: 'Nom d\'utilisateur ou mot de passe incorrect' 
      });
    }

    const isValid = await Admin.verifyPassword(admin, password);
    if (!isValid) {
      logger.warn(`Tentative de connexion échouée - Mauvais mot de passe: ${username}`);
      return res.status(401).json({ 
        success: false, 
        message: 'Nom d\'utilisateur ou mot de passe incorrect' 
      });
    }

    await Admin.updateLastLogin(admin.id);
    const token = generateToken(admin);

    logger.info(`Connexion réussie: ${username}`);

    res.json({
      success: true,
      message: 'Connexion réussie',
      data: {
        token,
        admin: {
          id: admin.id,
          username: admin.username,
          nom: admin.nom,
          email: admin.email,
          role: admin.role
        }
      }
    });
  } catch (error) {
    logger.error('Erreur login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la connexion' 
    });
  }
};

exports.logout = async (req, res) => {
  try {
    logger.info(`Déconnexion: ${req.admin?.username}`);
    res.json({
      success: true,
      message: 'Déconnexion réussie'
    });
  } catch (error) {
    logger.error('Erreur logout:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la déconnexion' 
    });
  }
};

exports.verifyToken = async (req, res) => {
  try {
    const admin = req.admin;
    res.json({
      success: true,
      data: {
        admin: {
          id: admin.id,
          username: admin.username,
          nom: admin.nom,
          email: admin.email,
          role: admin.role
        }
      }
    });
  } catch (error) {
    logger.error('Erreur verifyToken:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la vérification' 
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.admin.id;

    const admin = await Admin.findByIdWithPassword(adminId);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Administrateur non trouvé'
      });
    }

    const isValid = await bcrypt.compare(currentPassword, admin.password_hash);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Mot de passe actuel incorrect'
      });
    }

    await Admin.update(adminId, { password: newPassword });

    logger.info(`Mot de passe changé: ${admin.username}`);
    res.json({
      success: true,
      message: 'Mot de passe changé avec succès'
    });
  } catch (error) {
    logger.error('Erreur changePassword:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors du changement de mot de passe' 
    });
  }
};

exports.createAdmin = async (req, res) => {
  try {
    const { username, nom, email, password, role } = req.body;

    const existingUsername = await Admin.findByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ce nom d\'utilisateur est déjà utilisé' 
      });
    }

    const existingEmail = await Admin.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cet email est déjà utilisé' 
      });
    }

    const admin = await Admin.create({ username, nom, email, password, role });
    
    logger.info(`Nouvel admin créé: ${username} par ${req.admin.username}`);
    res.status(201).json({
      success: true,
      message: 'Administrateur créé avec succès',
      data: admin
    });
  } catch (error) {
    logger.error('Erreur createAdmin:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la création' 
    });
  }
};