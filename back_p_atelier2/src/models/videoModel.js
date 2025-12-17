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
  },

  // Tous nos videos
  async getAllVideos() {
    const [rows] = await pool.query("SELECT * FROM videos ORDER BY created_at DESC");
    return rows;
  },
  //video par son id
  async getVideoById(id) {
    const [rows] = await pool.query("SELECT * FROM videos WHERE id = ?", [id]);
    //si pas de video trouvee, on retourne null
    return rows[0] || null;
  },


  //ici je gere mon update de mon video
  async update({pseudo, title, description, theme_id, thumbnail}){

    const [result] = await pool.query(
      `UPDATE videos SET pseudo = ?, title = ?, description = ?, theme_id = ?, thumbnail = ? WHERE id = ?`,
      [pseudo, title, description, theme_id, thumbnail, id]
    );
    
    return result;
  }
};

module.exports = Video;
