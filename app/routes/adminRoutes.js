const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, checkRole } = require('../middleware/auth');

// Route pour lister tous les admins (Super Admin uniquement)
router.get('/',
  auth,
  checkRole(['Super Administrateur']),
  adminController.listeAdmins
);

// Route pour obtenir un admin par ID
router.get('/:id',
  auth,
  adminController.getAdminById
);

// Route pour mettre à jour un admin
router.put('/:id',
  auth,
  adminController.updateAdmin
);

// Route pour désactiver/activer un admin
router.patch('/:id/toggle',
  auth,
  checkRole(['Super Administrateur']),
  adminController.toggleAdmin
);

// Route pour supprimer un admin
router.delete('/:id',
  auth,
  checkRole(['Super Administrateur']),
  adminController.deleteAdmin
);

// Route pour obtenir le profil de l'admin connecté
router.get('/profile/me',
  auth,
  adminController.getProfile
);

module.exports = router;