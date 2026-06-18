const Partenaire = require('../models/Partenaire');
const logger = require('../config/logger');

exports.inscrirePartenaire = async (req, res) => {
  try {
    const partenaire = await Partenaire.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Votre engagement a été enregistré avec succès.',
      data: {
        reference: partenaire.reference,
        id: partenaire.id,
        nom: partenaire.nom,
        prenoms: partenaire.prenoms
      }
    });
  } catch (error) {
    logger.error('Erreur inscription partenaire:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de l\'inscription' 
    });
  }
};

exports.listePartenaires = async (req, res) => {
  try {
    const { search, type_donateur, formule, statut, pays, limit, offset } = req.query;
    const partenaires = await Partenaire.findAll({
      search,
      type_donateur,
      formule,
      statut,
      pays,
      limit,
      offset
    });
    
    res.json({ 
      success: true, 
      data: partenaires,
      count: partenaires.length
    });
  } catch (error) {
    logger.error('Erreur liste partenaires:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération des données' 
    });
  }
};

exports.getPartenaireById = async (req, res) => {
  try {
    const partenaire = await Partenaire.findById(req.params.id);
    if (!partenaire) {
      return res.status(404).json({ 
        success: false, 
        message: 'Partenaire non trouvé' 
      });
    }
    res.json({ success: true, data: partenaire });
  } catch (error) {
    logger.error('Erreur getPartenaireById:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

exports.updatePartenaire = async (req, res) => {
  try {
    const partenaire = await Partenaire.update(req.params.id, req.body);
    if (!partenaire) {
      return res.status(404).json({ 
        success: false, 
        message: 'Partenaire non trouvé' 
      });
    }
    res.json({ success: true, data: partenaire });
  } catch (error) {
    logger.error('Erreur updatePartenaire:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

exports.updateStatut = async (req, res) => {
  try {
    const { id } = req.params;
    const { statut } = req.body;
    const adminId = req.admin.id;

    if (!statut) {
      return res.status(400).json({
        success: false,
        message: 'Le statut est requis'
      });
    }

    const partenaire = await Partenaire.updateStatut(id, statut, adminId);
    if (!partenaire) {
      return res.status(404).json({ 
        success: false, 
        message: 'Partenaire non trouvé' 
      });
    }
    res.json({ success: true, data: partenaire });
  } catch (error) {
    logger.error('Erreur updateStatut:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};

exports.deletePartenaire = async (req, res) => {
  try {
    const result = await Partenaire.delete(req.params.id);
    if (!result) {
      return res.status(404).json({ 
        success: false, 
        message: 'Partenaire non trouvé' 
      });
    }
    res.json({ 
      success: true, 
      message: 'Partenaire supprimé avec succès' 
    });
  } catch (error) {
    logger.error('Erreur deletePartenaire:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};