const { body, validationResult } = require('express-validator');
const xss = require('xss');

// Sanitize inputs
const sanitizeInputs = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = xss(req.body[key].trim());
      }
    });
  }
  next();
};

// Validation du partenaire
const validatePartenaire = [
  body('type_donateur')
    .notEmpty().withMessage('Le type de donateur est requis')
    .isIn(['Donateur particulier', 'Église/Communauté', 'Entreprise/Organisme'])
    .withMessage('Type de donateur invalide'),
  
  body('formule')
    .notEmpty().withMessage('La formule est requise')
    .isIn(['Diamant', 'Or', 'Argent', 'Bronze'])
    .withMessage('Formule invalide'),
  
  body('nom')
    .notEmpty().withMessage('Le nom est requis')
    .isLength({ min: 2, max: 100 }).withMessage('Le nom doit faire entre 2 et 100 caractères'),
  
  body('prenoms')
    .notEmpty().withMessage('Les prénoms sont requis')
    .isLength({ min: 2, max: 100 }).withMessage('Les prénoms doivent faire entre 2 et 100 caractères'),
  
  body('genre')
    .optional()
    .isIn(['Homme', 'Femme', 'Autre']).withMessage('Genre invalide'),
  
  body('telephone')
    .notEmpty().withMessage('Le téléphone est requis')
    .isLength({ min: 8, max: 20 }).withMessage('Le téléphone doit faire entre 8 et 20 caractères'),
  
  body('whatsapp')
    .optional()
    .isLength({ max: 20 }).withMessage('Le WhatsApp ne doit pas dépasser 20 caractères'),
  
  body('email')
    .notEmpty().withMessage('L\'email est requis')
    .isEmail().withMessage('Email invalide')
    .normalizeEmail(),
  
  body('pays')
    .notEmpty().withMessage('Le pays est requis')
    .isLength({ min: 2, max: 50 }).withMessage('Le pays doit faire entre 2 et 50 caractères'),
  
  body('ville')
    .notEmpty().withMessage('La ville est requise')
    .isLength({ min: 2, max: 50 }).withMessage('La ville doit faire entre 2 et 50 caractères'),
  
  body('adresse')
    .notEmpty().withMessage('L\'adresse est requise')
    .isLength({ min: 5, max: 255 }).withMessage('L\'adresse doit faire entre 5 et 255 caractères')
];

// Validation du login
const validateLogin = [
  body('username')
    .notEmpty().withMessage('Le nom d\'utilisateur est requis'),
  body('password')
    .notEmpty().withMessage('Le mot de passe est requis')
];

// Middleware de validation des résultats
const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array() 
    });
  }
  next();
};

module.exports = {
  sanitizeInputs,
  validatePartenaire,
  validateLogin,
  validateResult
};