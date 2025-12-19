// const validate = (schema) => (req, res, next) => {
//   try {
    
//     req.body = schema.parse(req.body); //  permet de renvoyer requ.body validé, nettoyé et typé 
//     next();
//   } catch (error) {
//      console.error('Erreur de validation Zod:', error.errors);
   
//     return res.status(400).json({
//       message: 'Erreur de validation des données',
//       errors: error.errors || error.message || 'Erreur inconnue',
//     });
//   }
// };

// module.exports = { validate };

const validate = (schema, source = 'body') => (req, res, next) => {
  try {
    // Si source est 'query', on valide req.query, sinon req.body
    const dataToValidate = source === 'query' ? req.query : req.body;
    console.log("Données reçues pour validation:", dataToValidate); // DEBUG
    
    const validatedData = schema.parse(dataToValidate);
    console.log("Données après validation Zod:", validatedData); // DEBUG
    // On réinjecte les données nettoyées au bon endroit
    if (source === 'query') {
      req.query = validatedData;
    } else {
      req.body = validatedData;
    }
    
    next();
  } catch (error) {
    console.log("Zod a détecté une erreur !"); // DEBUG
    return res.status(400).json({
      message: 'Erreur de validation des données',
      errors: error.errors,
    });
  }
};
module.exports = { validate};