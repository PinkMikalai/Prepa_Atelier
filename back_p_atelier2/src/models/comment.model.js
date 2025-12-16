const db = require("../db/index.js");

module.exports = {

// Ajout de commentaire qui nécessite l'id de la video , le pseudo, et le contenu
  async addComment(video_id, pseudo, content) {
    const [result] = await db.execute(
      "INSERT INTO comments (video_id, pseudo, content) VALUES (?, ?, ?)",
      [video_id, pseudo, content]
    );
    return result.insertId;
  },

// Afficeher tous les commentaires associées à une vidéo
  async getCommentsByVideo(video_id) {
    const [result] = await db.execute(
      "SELECT * FROM comments WHERE video_id = ? ORDER BY created_at DESC",
      [video_id]
    );
    return result;
  },

  // Afficher un commentaire
  async getCommentById(comment_id) {
    const [result] = await db.execute(
      "SELECT * FROM comments WHERE id = ?",
      [comment_id]
    );
    return result;
  },

//  modifier un commentaire
  async updateComment(comment_id, content) {
    const [result] = await db.execute(
      `UPDATE comments
       SET content = ?
       WHERE id = ?`,
      [content, comment_id]
    );
    return result.affectedRows;
  },

 // supprimer un commentaire
  async deleteComment(comment_id) {
    const [result] = await db.execute(
      "DELETE FROM comments WHERE id = ?",
      [comment_id]
    );
    return result.affectedRows;
  }
};

