const { z } = require('zod');

// schéma de validation des données pour la création des videos

const createCommentSchema = z.object({
    pseudo: z.string().min(1, 'Pseudo obligatoire'),
    content: z.string().min(1, 'Le commentaire ne peut pas être vide')
}
)

// schéma de validation des données pour la modification des commentaires 

const updateCommentSchema = z.object({
    content: z.string().min(1)
}
).refine(
  data =>
    data.content !== undefined ||
   
  {
    message: `Aucune modification n'a été effectuée`,
  }
);

module.exports = { createCommentSchema, updateCommentSchema };
