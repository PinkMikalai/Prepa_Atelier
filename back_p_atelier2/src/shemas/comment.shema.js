const { z } = require('zod');

const createCommentSchema = z.object({
    video_id: z.number().int().positive(),
    pseudo: z.string().min(1, 'Pseudo obligatoire'),
    content: z.string().min(1, 'Le commentaire ne peut pas être vide')
}
)

const updateCommentSchema = z.object({
    pseudo: z.string().min(1, 'Pseudo obligatoire'),
    content: z.string().min(1, 'Le commentaire ne peut pas être vide')
}
)

module.exports = { createCommentSchema, updateCommentSchema };
