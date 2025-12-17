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
    }
}

module.exports = {
    createRatingModel : Rating.create
}