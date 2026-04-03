const {registerUser, loginUser, verifyEmail} = require('../services/authService');
const {successResponse, errorResponse} = require('../utils/apiResponse');

const register = async (req, res) => {
    const {fullName, email, password} = req.body;
    if(!fullName || !email || !password){
        return errorResponse(res, 400, 'All fields required');
    }
    
    try {
        await registerUser(fullName, email, password);
        return successResponse(res, 201, 'Please check your email for verification link');
    } catch (error) {
        if(error.message == 'Email exists'){
            return errorResponse(res, 409, 'Email exists already');
        }
        return errorResponse(res, 500, 'Server Error');
    }
}

const login = async(req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        return errorResponse(res, 400,'All fields are required');
    }
    try {
        const data = await  loginUser(email, password);
        return successResponse(res, 201, 'Login success', data)
    } catch (error) {
        if(error.message == 'Email is not Verified'){
            return errorResponse(res, 403, 'Please verify your email first');
        }
        if(error.message == 'Credentials are Invalid'){
            return errorResponse(res, 401, 'Invalid email or password');
        }
        return errorResponse(res, 500, 'Server error');
    }
}

const verify = async(req, res)=> {
    const {token} = req.query;
    if(!token){
        return errorResponse(res, 400,'Token is required');
    }
    try {
        await  verifyEmail(token);
        return successResponse(res, 200, 'Verification success')
    } catch (error) {
        if(error.message == 'Token is Invalid'){
            return errorResponse(res, 403, 'Invalid or expired token');
        }
        return errorResponse(res, 500, 'Server error');
    }
}

module.exports = {register, login, verify};