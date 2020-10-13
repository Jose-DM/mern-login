const jwt = require("jsonwebtoken");
// este middleware es para verificar que esté logeado
const auth = (req,res,next) => {
  try{
    // recoje el token del header
    const token = req.header("x-auth-token");
    // si no existe el token deniego el acceso
    if(!token)
        return res.status(401).json({msg: "No auth token, acceso denegado"});
    // verifico que sea un token valido por motivos de seguridad
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if(!verified)
        return res.status(401).json({msg: "Token verification failed, acceso denegado"});

    req.user = verified.id;
    next();
}catch(err) {
        res.status(500).json({error: err.message})
 }
}; 

module.exports = auth;