// utils
import makeValidation from '@withvoid/make-validation';
// models
import UserModel, { USER_TYPES } from '../models/User.js';
import HttpError from '../shared/error/app-error';
import { ERROR_CODE } from '../shared/error/errorCodes';
import OtpService from '../services/OtpService';
import { OTP_EXPIRE_SECOND, OTP_LENGTH } from '../shared/utils/OtpConstant';
import { ContextOtpCode } from '../shared/common/stringUtils';



export default {
    onGetAllUsers: async(req, res) => {
        try {
            const users = await UserModel.getUsers();
            return res.status(200).json({ success: true, users });
        } catch (error) {
            return res.status(error.status || 500).json({ success: false, errorCode: error.status || 500, error: error.message })
        }
    },
    onGetUserById: async(req, res) => {
        try {
            const user = await UserModel.getUserById(req.params.id);
            return res.status(200).json({ success: true, user });
        } catch (error) {
            return res.status(error.status || 500).json({ success: false, errorCode: error.status || 500, error: error.message })
        }
    },
    onCreateUser: async(req, res) => {
        try {
            const payload = req.body
            const validation = makeValidation(types => ({
                payload: payload,
                checks: {
                    userName: { type: types.string },
                    fullName: { type: types.string },
                }
            }));
            if (!validation.success) return res.status(400).json({...validation });


            const user = await UserModel.createUser(payload);
            return res.status(200).json({ success: true, user });
        } catch (error) {
            return res.status(error.status || 500).json({ success: false, errorCode: error.status || 500, error: error.message })
        }
    },
    requestSendOTP: async(req, res) => {
        try {
            console.log('req body: ', req.body)
            const { context, identity, method, format } = req.body;
            console.log('context: ', context)

            if (context !== ContextOtpCode.CREATE_USER)
                await UserModel.getUserByIndentify(identity)

            const otpCode = await OtpService.generateOtp(
                context,
                identity,
                OTP_EXPIRE_SECOND,
                OTP_LENGTH,
                format
            );
            return res.status(200).json({
                success: true,
                data: otpCode
            });
        } catch (error) {
            return res.status(error.status || 500).json({ success: false, errorCode: error.status || 500, error: error.message })
        }
    },
    validateOtp: async(req, res) => {
        try {
            const { context, identity, otpCode } = req.body;

            const result = await OtpService.validateOTPVMobile(context, identity, otpCode);

            return res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            return res.status(error.status || 500).json({ success: false, errorCode: error.status || 500, error: error.message })
        }
    },
    onDeleteUserById: async(req, res) => {
        try {
            const user = await UserModel.deleteByUserById(req.params.id);
            return res.status(200).json({
                success: true,
                message: `Deleted a count of ${user.deletedCount} user.`
            });
        } catch (error) {
            return res.status(error.status || 500).json({ success: false, errorCode: error.status || 500, error: error.message })
        }
    },
    onChangePassword: async(req, res) => {
        try {
            await UserModel.changePassword(req.body, req.userId)
            return res.status(200).json({
                success: true,
            });
        } catch (error) {
            return res.status(error.status || 500).json({ success: false, errorCode: error.status || 500, error: error.message })
        }
    },
    onResetPassword: async(req, res) => {
        try {
            console.log('Body: ', req.body)
            await UserModel.resetPassword(req.body)

            return res.status(200).json({
                success: true,
            });
        } catch (error) {
            return res.status(error.status || 500).json({ success: false, errorCode: error.status || 500, error: error.message })
        }
    }
}