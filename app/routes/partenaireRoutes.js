const express = require('express');
const router = express.Router();
const partenaireController = require('../controllers/partenaireController');
const { auth, checkRole } = require('../middleware/auth');
const { validatePartenaire, validateResult, sanitizeInputs } = require('../middleware/validation');
const { inscriptionLimiter } = require('../middleware/rateLimiter');

// Route publique d'inscription (sans authentification)
router.post('/inscription',
  inscriptionLimiter,
  sanitizeInputs,
  validatePartenaire,
  validateResult,
  partenaireController.inscrirePartenaire
);

// Routes protégées (authentification requise)
router.get('/',
  auth,
  partenaireController.listePartenaires
);

router.get('/:id',
  auth,
  partenaireController.getPartenaireById
);

router.put('/:id',
  auth,
  sanitizeInputs,
  partenaireController.updatePartenaire
);

router.patch('/:id/statut',
  auth,
  partenaireController.updateStatut
);

router.delete('/:id',
  auth,
  checkRole(['Super Administrateur', 'Administrateur']),
  partenaireController.deletePartenaire
);

module.exports = router;