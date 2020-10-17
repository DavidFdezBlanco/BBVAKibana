const jwt = require('jsonwebtoken');

function mustBeLoggedIn(req, res, next) {


    const private_key = process.env.JWT_PRIVATE_KEY + "";

    const token = req.headers['authorization'];
    console.log("Token ", token);
    if (token) {
        jwt.verify(token.replace("Bearer ", ""), private_key, (err, decoded) => {
            if (err) {
                return res.status(401).json({message: 'Invalid Token'});
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.send({
            message: 'Token not found'
        });
    }
    console.log('Request logged:', req.method, req.path);
    next()
}

module.exports = {
    mustBeLoggedIn
};
