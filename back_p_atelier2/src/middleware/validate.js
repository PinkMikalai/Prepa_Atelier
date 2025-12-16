const validate = (schema) => (req, res, next) => {
  try {
    
    req.body = schema.parse(req.body); //  permet de renvoyer requ.body validé, nettoyé et typé 
    next();
  } catch (error) {
   
    return res.status(400).json({
      message: 'Erreur de validation des données',
      errors: error.errors,
    });
  }
};

module.exports = { validate };