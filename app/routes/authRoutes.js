const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { auth, checkRole } = require('../middleware/auth');
const { validateLogin, validateResult, sanitizeInputs } = require('../middleware/validation');

// Route de connexion
router.post('/login',
  sanitizeInputs,
  validateLogin,
  validateResult,
  authController.login
);

// Route de déconnexion
router.post('/logout',
  auth,
  authController.logout
);

// Route pour vérifier le token
router.get('/verify',
  auth,
  authController.verifyToken
);

// Route de changement de mot de passe
router.post('/change-password',
  auth,
  [
    body('currentPassword').notEmpty().withMessage('Le mot de passe actuel est requis'),
    body('newPassword').isLength({ min: 6 }).withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères')
  ],
  validateResult,
  authController.changePassword
);

// Route de création d'admin (Super Admin uniquement)
router.post('/admins',
  auth,
  checkRole(['Super Administrateur']),
  sanitizeInputs,
  [
    body('username').notEmpty().withMessage('Le nom d\'utilisateur est requis'),
    body('nom').notEmpty().withMessage('Le nom est requis'),
    body('email').isEmail().withMessage('Email invalide'),
    body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères')
  ],
  validateResult,
  authController.createAdmin
);

module.exports = router;