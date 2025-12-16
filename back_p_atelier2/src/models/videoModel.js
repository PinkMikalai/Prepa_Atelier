const pool = require('../db/index.js');

const Video = {
  async create({ pseudo, title, description, theme_id, thumbnail }) {
    const [result] = await pool.query(
      `INSERT INTO videos (pseudo, title, description, theme_id, thumbnail)
       VALUES (?, ?, ?, ?, ?)`,
      [pseudo, title, description, theme_id, thumbnail]
    );
    return result.insertId;
  },

  async findByTitle(title) {
    const [rows] = await pool.query(
      `SELECT * FROM videos WHERE title = ?`,
      [title]
    );
    return rows[0] || null;
  }
};

module.exports = Video;
