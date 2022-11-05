import express from 'express';
// controllers
import user from '../controllers/user.js';
const validation = require('../middleware/validation-middleware');
import { decode } from '../middleware/jwt'
const router = express.Router();


router
    .get('/users/', user.onGetAllUsers)
    .post('/users/', validation.signup, user.onCreateUser)
    .post('/users/change-password/', [decode, validation.changePassword], user.onChangePassword)
    .post('/users/retrieve-password/', user.onResetPassword)
    .post('/users/request-send-otp/', user.requestSendOTP)
    .post('/validate-otp/', user.validateOtp)
    .get('/users/:id', user.onGetUserById)
    .delete('/users/:id', user.onDeleteUserById)

export default router;