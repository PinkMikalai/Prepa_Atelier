const { z } = require('zod');

// schéma de la validation des données pour la création des métadonnées d'une vidéo
const createVideoSchema = z.object({
  pseudo: z.string().min(1, 'Le pseudo est obligatoire'),
  title: z.string().min(1, 'Le titre est obligatoire'),
  description: z.string().optional(),
  theme_id : z.number().int().min(1, 'Un théme doit être choisi'),

});
// schéma de la validation des données pour la modification des métadonnées d'une vidéo
const updateVideoSchema = z.object({
  pseudo: z.string().min(1, 'Le pseudo est obligatoire').optional(),
  title: z.string().min(1, 'Le titre est obligatoire').optional(),
  description: z.string().optional(),
  theme_îd : z.number().int().min(1, 'Un théme doit être choisi').optional(),


}).refine( // il faut au moins modifier un élément pour valiser la modification
  data =>
    data.pseudo !== undefined ||
    data.title !== undefined ||
    data.description !== undefined ||
    data.theme_id !== undefined,
  {
    message: 'Au moins un champ doit êtte modifié',
  }
);

module.exports = { createVideoSchema, updateVideoSchema };