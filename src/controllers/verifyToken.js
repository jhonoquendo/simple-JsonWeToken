
const jwt = require('jsonwebtoken');
const config = require('../config');

function verifyToken(req,res,next){
    //Verificamos que tenga una cabecera
    const token = req.headers['x-access-token'];

    //Vemos si existe
    if(!token){
        return res.status(401).json({
            auth:false,
            message: 'No tienes el token'
        });
    }

    //Verificamos que el token sea valido
    const decode = jwt.verify(token,config.secret);
    req.userId = decode.id;
    next(); //Verica y deja seguir la ruta
}

module.exports = verifyToken;