const jwt = require('jsonwebtoken');
const {errorResponse}  = require('../utils/apiResponse');

const protect = async (req, res, next)=> {
    try {
        // Getting token from header
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return errorResponse(res, 401, 'No token provided');
        }

        // Extract Token
        const token = authHeader.split(' ')[1];

        // Verify Token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        //Attach user to request
        req.user = decodedToken;

        next();
    } catch (error) {
        if(error.name == 'TokenExpiredError'){
            return errorResponse(res, 401, 'Tolen expired');
        }
        return errorResponse(res, 401, 'Invalid Token')
    }
};

module.exports = {protect};