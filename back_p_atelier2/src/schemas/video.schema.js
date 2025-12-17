const { z } = require('zod');

const createVideoSchema = z.object({
  pseudo: z.string().min(1, 'Le pseudo est obligatoire'),
  title: z.string().min(1, 'Le titre est obligatoire'),
  description: z.string().optional(),
  theme_id : z.coerce.number().int().min(1, 'Un théme doit être choisi'),

});

const updateVideoSchema = z.object({
  pseudo: z.string().min(1, 'Le pseudo est obligatoire'),
  title: z.string().min(1, 'Le titre est obligatoire'),
  description: z.string().optional(),
  theme_îd : z.coerce.number().int().min(1, 'Un théme doit être choisi'),

});

module.exports = { createVideoSchema, updateVideoSchema };