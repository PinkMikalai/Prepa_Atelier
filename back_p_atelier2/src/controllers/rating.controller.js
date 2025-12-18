const { pool, testConnection } = require('../db/index.js');
const Video = require('../models/videoModel.js');
const Rating = require('../models/ratingModel.js');
const ratingService = require('../services/rating.service.js');



function getRatings(req, res) {
}

function getRatingById(req, res) {
}

async function createRat(req, res) {
    try {
        const video_id = req.params.video_id;
        const rating = req.body.rating;
        // console.log(req.body, req.body.rating);

        const result = await ratingService.createRating({ video_id, rating });
        
        if (result.success === true) {
            res.status(201).json({
            success: true,
            message: `La note à la vidéo a bien été ajoutée`,
            data: rating
        })
        } else {
            res.status(400).json({
                success: false,
                message: "La note n'a pu être ajoutée", 
                data: result
            })
        } 
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Erreur serveur"
        })
    }
    
}

function updateRating(req, res) {
}

function deleteRating(req, res) {
}

module.exports = { 
    getRatings, 
    getRatingById, 
    createRat, 
    updateRating, 
    deleteRating 
};