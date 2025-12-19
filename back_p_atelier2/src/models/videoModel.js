const pool = require('../db/index.js');

const Video = {
  async create({ pseudo, title, description, theme_id, thumbnail, video_path }) {
    const [result] = await pool.query(
      `INSERT INTO videos (pseudo, title, description, theme_id, thumbnail, video_path)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [pseudo, title, description, theme_id, thumbnail, video_path]
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
  async update(id, { pseudo, title, description, theme_id, thumbnail }) {

    const [result] = await pool.query(
      `UPDATE videos SET pseudo = ?, title = ?, description = ?, theme_id = ?, thumbnail = ? WHERE id = ?`,
      [pseudo, title, description, theme_id, thumbnail, id]
    );

    return result;
  },
  // ici ma function (req sql) pour delete ma video
  async delete(id){
    //ici ma req sql
    const [result] = await pool.query("DELETE FROM videos WHERE id = ?", [id]); 
    return result;
  },
  // recherche et filtrage 
  async findWithFilters({ search, theme_id, date, rating, sortBy = 'created_at', order = 'DESC' }) {
    let query = "SELECT * FROM videos WHERE 1=1";
    const params = [];

    // Barre de recherche
    if (search) {
      query += " AND (title LIKE ? OR description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    // Filtre par Thème
    if (theme_id) {
      query += " AND theme_id = ?";
      params.push(theme_id);
    }

    // Filtre par Date 
    if (date) {
      if (date === 'today') query += " AND created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY)";
      else if (date === 'week') query += " AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
      else if (date === 'month') query += " AND created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)";
      else if (date === 'year') query += " AND created_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR)";
    }

    //  Filtre par Rating le
    if (rating) {
      query += " AND rating >= ?";
      params.push(rating);
    }

    // Sécurisation du tri
    const allowedColumns = ['created_at', 'title', 'rating', 'views'];
    const finalSortBy = allowedColumns.includes(sortBy) ? sortBy : 'created_at';
    const finalOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    query += ` ORDER BY ${finalSortBy} ${finalOrder}`;

    const [rows] = await pool.query(query, params);
    return rows;
  }
};

module.exports = Video;
