const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { auth } = require('../middleware/auth');

// Toutes les routes de stats nécessitent une authentification
router.get('/dashboard',
  auth,
  statsController.getDashboardStats
);

router.get('/partenaires',
  auth,
  statsController.getPartenairesStats
);

router.get('/formules',
  auth,
  statsController.getFormulesStats
);

router.get('/types',
  auth,
  statsController.getTypesStats
);

router.get('/pays',
  auth,
  statsController.getPaysStats
);

router.get('/statuts',
  auth,
  statsController.getStatutsStats
);

router.get('/evolution',
  auth,
  statsController.getEvolutionStats
);

module.exports = router;