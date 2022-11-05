// utils
import makeValidation from '@withvoid/make-validation';
// models
import ConversationModel from '../models/Conversation';
import HttpError from '../shared/error/app-error';
import { ERROR_CODE } from '../shared/error/errorCodes';
import OtpService from '../services/OtpService';
import { OTP_EXPIRE_SECOND, OTP_LENGTH } from '../shared/utils/OtpConstant';
import { ContextOtpCode } from '../shared/common/stringUtils';



export default {
    //new conv
    onCreateNewConversation: async(req, res) => {
        try {
            const payload = req.body
            const data = await ConversationModel.createNewConversation(payload);
            return res.status(200).json({ success: true, data });
        } catch (error) {
            return res.status(error.status || 500).json({ success: false, errorCode: error.status || 500, error: error.message })
        }
    },

    //get conv by id
    onGetConversationById: async(req, res) => {
        try {
            const convId = req.params.id
            const data = await ConversationModel.getConversationById(convId);
            return res.status(200).json({ success: true, data });
        } catch (error) {
            return res.status(error.status || 500).json({ success: false, errorCode: error.status || 500, error: error.message })
        }
    },

    //get conv of a user
    onGetConversationByUser: async(req, res) => {
        try {
            const userId = req.params.userId
            console.log("userId: ", userId)
            const data = await ConversationModel.getConversationByUser(userId);
            return res.status(200).json({ success: true, data });
        } catch (error) {
            return res.status(error.status || 500).json({ success: false, errorCode: error.status || 500, error: error.message })
        }
    },

    // get conv includes two userId
    onGetPrivateConversation: async(req, res) => {
        try {
            const { firstUserId, secondUserId } = req.params
            const data = await ConversationModel.getPrivateConversation(firstUserId, secondUserId);
            return res.status(200).json({ success: true, data });
        } catch (error) {
            return res.status(error.status || 500).json({ success: false, errorCode: error.status || 500, error: error.message })
        }
    },

    // Add new member to conversation //
    onAddMemberConversation: async(req, res) => {
        try {
            const { memberId_arr, conversationId } = req.body
            console.log("member_arr: ", memberId_arr)
            const data = await ConversationModel.addMemberConversation(memberId_arr, conversationId);
            return res.status(200).json({ success: true, data });
        } catch (error) {
            return res.status(error.status || 500).json({ success: false, errorCode: error.status || 500, error: error.message })
        }
    },



}