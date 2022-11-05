// utils
import makeValidation from '@withvoid/make-validation';
// models
import MessageModel from '../models/Message';
import HttpError from '../shared/error/app-error';
import { ERROR_CODE } from '../shared/error/errorCodes';
import OtpService from '../services/OtpService';
import { OTP_EXPIRE_SECOND, OTP_LENGTH } from '../shared/utils/OtpConstant';
import { ContextOtpCode } from '../shared/common/stringUtils';


export default {
    //new conv
    onCreateNewMessages: async(req, res) => {
        try {
            const payload = req.body
            console.log("payload: ", payload)
            const data = await MessageModel.createNewMessage(payload);
            return res.status(200).json({ success: true, payload });
        } catch (error) {
            return res.status(error.status || 500).json({ success: false, errorCode: error.status || 500, error: error.message })
        }
    },

}