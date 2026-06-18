const pool = require('../config/database');
const bcrypt = require('bcrypt');
const logger = require('../config/logger');

class Admin {
  static async findByUsername(username) {
    try {
      const query = 'SELECT * FROM administrateurs WHERE username = $1 AND actif = true';
      const result = await pool.query(query, [username]);
      return result.rows[0];
    } catch (error) {
      logger.error('Erreur findByUsername:', error);
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const query = 'SELECT * FROM administrateurs WHERE email = $1 AND actif = true';
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      logger.error('Erreur findByEmail:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const query = 'SELECT id, username, nom, email, role, actif, last_login, created_at FROM administrateurs WHERE id = $1';
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      logger.error('Erreur findById:', error);
      throw error;
    }
  }

  static async findByIdWithPassword(id) {
    try {
      const query = 'SELECT * FROM administrateurs WHERE id = $1';
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      logger.error('Erreur findByIdWithPassword:', error);
      throw error;
    }
  }

  static async findAll() {
    try {
      const query = 'SELECT id, username, nom, email, role, actif, last_login, created_at FROM administrateurs ORDER BY created_at DESC';
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      logger.error('Erreur findAll:', error);
      throw error;
    }
  }

  static async create(data) {
    const { username, nom, email, password, role = 'Gestionnaire' } = data;
    try {
      const password_hash = await bcrypt.hash(password, 10);
      
      const query = `
        INSERT INTO administrateurs (username, nom, email, password_hash, role)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, username, nom, email, role, actif, created_at
      `;
      const values = [username, nom, email, password_hash, role];
      const result = await pool.query(query, values);
      logger.info(`Admin créé: ${username}`);
      return result.rows[0];
    } catch (error) {
      logger.error('Erreur create admin:', error);
      throw error;
    }
  }

  static async updateLastLogin(id) {
    try {
      const query = 'UPDATE administrateurs SET last_login = NOW() WHERE id = $1 RETURNING *';
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      logger.error('Erreur updateLastLogin:', error);
      throw error;
    }
  }

  static async verifyPassword(admin, password) {
    try {
      return await bcrypt.compare(password, admin.password_hash);
    } catch (error) {
      logger.error('Erreur verifyPassword:', error);
      throw error;
    }
  }

  static async update(id, data) {
    try {
      const fields = [];
      const values = [];
      let index = 1;
      
      if (data.nom) { fields.push(`nom = $${index++}`); values.push(data.nom); }
      if (data.email) { fields.push(`email = $${index++}`); values.push(data.email); }
      if (data.role) { fields.push(`role = $${index++}`); values.push(data.role); }
      if (data.actif !== undefined) { fields.push(`actif = $${index++}`); values.push(data.actif); }
      if (data.password) {
        const password_hash = await bcrypt.hash(data.password, 10);
        fields.push(`password_hash = $${index++}`);
        values.push(password_hash);
      }
      
      if (fields.length === 0) return null;
      
      values.push(id);
      const query = `
        UPDATE administrateurs 
        SET ${fields.join(', ')}, updated_at = NOW()
        WHERE id = $${index}
        RETURNING id, username, nom, email, role, actif, last_login, created_at
      `;
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      logger.error('Erreur update admin:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const query = 'DELETE FROM administrateurs WHERE id = $1 RETURNING id';
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      logger.error('Erreur delete admin:', error);
      throw error;
    }
  }
}

module.exports = Admin;