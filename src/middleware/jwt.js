import jwt from 'jsonwebtoken';
// models
import UserModel from '../models/User.js';

const SECRET_KEY = 'glopr-chatapp-2022';

export const encode = async(req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.authenticateUser(email, password);
        const payload = {
            userId: user.id,
            userEmail: user.email,
            userPhoneNumber: user.phoneNumber
        };
        const authToken = jwt.sign(payload, SECRET_KEY);
        req.authToken = authToken;
        req.userInfo = user;
        next();
    } catch (error) {
        //return res.status(400).json({ success: false, message: error.error });
        return res.status(error.status || 500).json({ success: false, errorCode: error.status || 500, error: error.message })
    }
}

export const decode = (req, res, next) => {
    if (!req.headers['authorization']) {
        return res.status(400).json({ success: false, message: 'No access token provided' });
    }
    const accessToken = req.headers.authorization.split(' ')[1];
    try {
        const decoded = jwt.verify(accessToken, SECRET_KEY);
        req.userId = decoded.userId
        req.userEmail = decoded.userEmail;
        req.userPhoneNumber = decoded.userPhoneNumber;

        return next();
    } catch (error) {
        return res.status(401).json({ success: false, message: error.message });
    }
}