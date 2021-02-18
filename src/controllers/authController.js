const {Router} = require('express');
const router = Router();

const jwt = require('jsonwebtoken');
const config = require('../config');

const verifyToken = require('./verifyToken');

const User = require('../models/User');

router.post('/register', async (req,res,next) => {
    const {username,email,password} = req.body;
    const user = new User({
        username,
        email,
        password
    });
    //Encriptamos la contraseña
    user.password = await user.encryptPassword(user.password);
    await user.save();

    //Creamos un token con el id del usuario
    const token = jwt.sign({id: user._id},config.secret,{
        expiresIn: 60 * 60 * 24
    });

    res.json({auth: true,token:token});
});

router.get('/profile',verifyToken, async (req,res,next) => {
    
    // req.userId -> es lo que viene del middelware  //verifyToken

    const user = await User.findById(req.userId,{password:0});

    if(!user){
        return res.status(404).send('No user Found');
    }  

    res.json(user);
});


router.post('/signin', async (req,res,next) => {

    const {email,password} = req.body;

    const user = await User.findOne({email:email});
    if(!user){
        return res.status(404).send("El correo no existe");
    }

    const validPassword = await user.validatePassword(password); 

    if(!validPassword){
        return res.status(401).json({auth:false,token:null});
    }

    const token = jwt.sign({id:user._id},config.secret,{
        expiresIn: 60 * 60 * 24
    });

    res.json({auth:true,token});
});


module.exports = router;