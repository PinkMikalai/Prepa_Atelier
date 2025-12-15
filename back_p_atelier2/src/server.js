

//carger les varibles d eviranement d .env
require("dotenv").config();


const app = require("./app");

//recuperation de l a port
const PORT= process.env.PORT;

if (!PORT){
    console.log("Le port n est past retrouvee, veuillez vous verifier le fichier env");

    // en cas si le port n est pas retouvee le proces d exEcution s arrete
    process.exit(1);
}

app.listen(PORT,()=>{
    console.log(`serveur lance sur le port ${PORT}, Aaaaa Serife`);
    
});