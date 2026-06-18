const pool = require('../config/database');
const logger = require('../config/logger');
const generateReference = require('../utils/generateReference');

class Partenaire {
  static async create(data) {
    const { 
      type_donateur, formule, nom, prenoms, genre,
      telephone, whatsapp, email, pays, ville, adresse
    } = data;

    try {
      const reference = await generateReference();
      
      const query = `
        INSERT INTO partenaires (
          reference, type_donateur, formule, nom, prenoms, genre,
          telephone, whatsapp, email, pays, ville, adresse, statut
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING *
      `;
      
      const values = [
        reference, type_donateur, formule, nom, prenoms, genre,
        telephone, whatsapp, email, pays, ville, adresse, 'Nouveau'
      ];
      
      const result = await pool.query(query, values);
      logger.info(`Nouveau partenaire créé: ${reference}`);
      return result.rows[0];
    } catch (error) {
      logger.error('Erreur create partenaire:', error);
      throw error;
    }
  }

  static async findAll(filters = {}) {
    try {
      let query = 'SELECT * FROM partenaires WHERE 1=1';
      const values = [];
      let index = 1;

      if (filters.type_donateur) {
        query += ` AND type_donateur = $${index++}`;
        values.push(filters.type_donateur);
      }
      if (filters.formule) {
        query += ` AND formule = $${index++}`;
        values.push(filters.formule);
      }
      if (filters.statut) {
        query += ` AND statut = $${index++}`;
        values.push(filters.statut);
      }
      if (filters.pays) {
        query += ` AND pays = $${index++}`;
        values.push(filters.pays);
      }
      if (filters.search) {
        query += ` AND (nom ILIKE $${index++} OR prenoms ILIKE $${index++} OR reference ILIKE $${index++} OR email ILIKE $${index++} OR telephone ILIKE $${index++})`;
        const searchTerm = `%${filters.search}%`;
        values.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
      }

      query += ' ORDER BY created_at DESC';
      
      if (filters.limit) {
        query += ` LIMIT $${index++}`;
        values.push(parseInt(filters.limit));
      }
      if (filters.offset) {
        query += ` OFFSET $${index++}`;
        values.push(parseInt(filters.offset));
      }

      const result = await pool.query(query, values);
      return result.rows;
    } catch (error) {
      logger.error('Erreur findAll partenaires:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const query = 'SELECT * FROM partenaires WHERE id = $1';
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      logger.error('Erreur findById partenaire:', error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const fields = [];
      const values = [];
      let index = 1;
      
      const allowedFields = [
        'type_donateur', 'formule', 'nom', 'prenoms', 'genre',
        'telephone', 'whatsapp', 'email', 'pays', 'ville', 'adresse', 'statut'
      ];
      
      for (const field of allowedFields) {
        if (data[field] !== undefined) {
          fields.push(`${field} = $${index++}`);
          values.push(data[field]);
        }
      }
      
      if (fields.length === 0) return null;
      
      values.push(id);
      const query = `
        UPDATE partenaires 
        SET ${fields.join(', ')}, updated_at = NOW()
        WHERE id = $${index}
        RETURNING *
      `;
      const result = await pool.query(query, values);
      logger.info(`Partenaire mis à jour: ${id}`);
      return result.rows[0];
    } catch (error) {
      logger.error('Erreur update partenaire:', error);
      throw error;
    }
  }

  static async updateStatut(id, nouveauStatut, adminId) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const old = await client.query(
        'SELECT statut FROM partenaires WHERE id = $1',
        [id]
      );
      const ancienStatut = old.rows[0]?.statut;

      const update = await client.query(
        'UPDATE partenaires SET statut = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        [nouveauStatut, id]
      );

      if (ancienStatut !== nouveauStatut) {
        await client.query(
          `INSERT INTO historique_statuts (partenaire_id, ancien_statut, nouveau_statut, admin_id)
           VALUES ($1, $2, $3, $4)`,
          [id, ancienStatut, nouveauStatut, adminId]
        );
        logger.info(`Statut changé: ${id} de ${ancienStatut} à ${nouveauStatut}`);
      }

      await client.query('COMMIT');
      return update.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error('Erreur updateStatut:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async delete(id) {
    try {
      const query = 'DELETE FROM partenaires WHERE id = $1 RETURNING id';
      const result = await pool.query(query, [id]);
      logger.info(`Partenaire supprimé: ${id}`);
      return result.rows[0];
    } catch (error) {
      logger.error('Erreur delete partenaire:', error);
      throw error;
    }
  }
}

module.exports = Partenaire;