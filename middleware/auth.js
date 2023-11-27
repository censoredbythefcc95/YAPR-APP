const jwt = require('jsonwebtoken');
const config = require('config');

// adding console logs to each parameter of function to troubleshoot.
module.exports = function(req, res, next) {
    //Get token from the header
    const token = req.header('x-auth-token');

    //check if not token or not found
    if (!token) {
        console.log('Denied');
        return res.status(401).json({ message: 'No token - authorization denied.'});
        
    }

    // Verify token and match to user
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        req.user = decoded.user;
        console.log('Decoded');
        next();
    } catch(err) {
        res.status(401).json({msg: 'Token is not valid'});
        console.log('Invalid');
    }
}