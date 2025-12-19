const pool = require('../db/index.js');

const Rating = {

    // requete sql qui me permet d'ajouter une note
    async create({video_id, rating}) {
        const [result] = await pool.query(
            `INSERT INTO ratings (video_id, rating)
            VALUES (?, ?)`,
            [video_id, rating]
        );
        return result.insertId
    },

    async ratingByVideo({ video_id }) {
    const [rows] = await pool.query(
        `SELECT rating FROM ratings WHERE video_id = ?`,
        [video_id]
    );
    return rows;
    },

    async incrementViews(video_id) {
    await pool.query(
        `UPDATE videos 
         SET views = views + 1, updated_at = NOW()
         WHERE id = ?`,
        [video_id]
    );
    }
}

module.exports = {
    createRatingModel : Rating.create,
    ratingByVideo : Rating.ratingByVideo,
    incrementViews : Rating.incrementViews
}