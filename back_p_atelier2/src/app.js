// import du packet express
const express = require("express");
const cors = require('cors');
const morgan = require('morgan');
const router = require("./routes");

//creer l application express
const app = express();

// active le middleware Morgan
app.use(morgan('dev')); // roquette log http
app.use(cors());  //autoriser les requests cross origin
app.use(express.json()); //parse le contenue de mon body
app.use("/up", router); //chercher touts mes routes (sous la route /videos)



//export app
module.exports = app;