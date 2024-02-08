const jwt = require('jsonwebtoken');

const verifyJWT = (req,res,next) => {
    const authHeader = req.headers['authorization'];
    if(!authHeader) return res.status(401).json({error: 'please login again', status: false});
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN,
        (err,decoded) => {
            if(err) return res.status(403).json({error: 'please login again', status: false});
            next();
        }
    )
} 

module.exports = verifyJWT