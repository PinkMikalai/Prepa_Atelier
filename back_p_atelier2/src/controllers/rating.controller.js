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
        
    } catch (error) {
        
    }
    const video_id = req.params.video_id;
    const rating = req.body.rating;
    // console.log(req.body, req.body.rating);
    
    const result = await ratingService.createRating({ video_id, rating });

    res.status(201).json({
        success: true,
        message: `La note à la vidéo a bien été ajoutée`,
        data: rating
    })
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