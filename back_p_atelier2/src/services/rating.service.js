const { createRating } = require("../controllers/rating.controller");
const { getVideoById } = require('../models/videoModel.js');
const { createRatingModel } = require('../models/ratingModel.js')


const ratingService = {

    async createRating({video_id, rating}) {

        // console.log("Service createRating appelé avec :", { video_id, rating });

        // Vérifier que video_id est fourni
        const video = await getVideoById(video_id);
        if(!video) {
            throw {success: false, message: "La vidéo n'existe pas"}
        }
        // console.log('que contient video', video);
        


        // Vérifier que rating est fourni et est un nombre
        if(rating === undefined || rating === null || typeof rating !== 'number') {
            throw {success: false, message: "Il n'y a pas de notes ou la note n'est pas un nombre"};
        } 

        // Vérifier que rating est compris entre 1 et 5
        if (rating < 1 || rating > 5) {
            throw {success: false, message: "La note est comprise entre 1 et 5"}
        } 

        // préparer l'objet à insérer 
        const newRating = {
            video_id: video_id,
            rating: rating
        };
        

        // insertId contiendra l'id de la note créée dans la table ratings, créer la note dans la bdd
        const insertId = await createRatingModel(newRating);

        return {
            success: true,
            message: 'note ajoutée',
            data: {
                id: insertId,
                video_id,
                rating
            }
        };
        
    },



}

module.exports = ratingService;