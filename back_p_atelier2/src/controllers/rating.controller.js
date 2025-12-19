const ratingService = require('../services/rating.service.js');
const Rating = require('../models/ratingModel.js')


async function createRat(req, res) {
    try {
        const video_id = req.params.video_id;
        const rating = req.body.rating;

        const result = await ratingService.createRating({ video_id, rating });

        if (!result.success) {
            return res.status(400).json(result);
        }

        res.status(201).json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur"
        });
    }
}

async function getAverage(req, res) {
    try {
        const video_id = req.params.video_id;

        const result = await ratingService.getAverageRating({ video_id });

        if (!result.success) {
            return res.status(404).json(result);
        }

        res.status(200).json(result);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur"
        });
    }
}

module.exports = {
    createRat,
    getAverage
};

