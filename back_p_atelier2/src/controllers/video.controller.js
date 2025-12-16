const { pool, testConnection } = require('../db/index.js');
// touts nos videos
async function getVideos(req, res) {

    console.log("ici test videos");

    await testConnection();
}


//video par son id
function getVideoById(req, res) {

}

//creer une video
function createVideo(req, res) {
}

//mettre a jour une video
function updateVideo(req, res) {
}

//supprimer une video
function deleteVideo(req, res) {
}


module.exports = { 
    getVideos, 
    getVideoById, 
    createVideo, 
    updateVideo, 
    deleteVideo 
};