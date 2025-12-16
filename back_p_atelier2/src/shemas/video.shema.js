const { z } = require('zod');

const createVideoSchema = z.object({
  pseudo: z.string().min(1, 'Le pseudo est obligatoire'),
  title: z.string().min(1, 'Le titre est obligatoire'),
  description: z.string().optional(),
  theme : z.number().int().min(1, 'Un théme doit être choisi'),
  thumbnail: z.string().optional()
});

const updateVideoSchema = z.object({
  pseudo: z.string().min(1, 'Le pseudo est obligatoire'),
  title: z.string().min(1, 'Le titre est obligatoire'),
  description: z.string().optional(),
  theme : z.number().int().min(1, 'Un théme doit être choisi'),
  thumbnail: z.string().optional()
});

module.exports = { createVideoSchema, updateVideoSchema };