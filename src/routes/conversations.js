import express from 'express';
// controllers
import conversations from '../controllers/conversations';
const validation = require('../middleware/validation-middleware');
import { decode } from '../middleware/jwt'
const router = express.Router();


router
    .post('/conversations', conversations.onCreateNewConversation)
    .get('/conversations/:id', conversations.onGetConversationById)
    .get('/conversations/user/:userId', conversations.onGetConversationByUser)
    .get("/conversations/find/:firstUserId/:secondUserId", conversations.onGetPrivateConversation)
    .put('/conversations/add-members', conversations.onAddMemberConversation)


export default router;