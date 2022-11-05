import express from 'express';
// controllers
import messages from '../controllers/messages';
const validation = require('../middleware/validation-middleware');
import { decode } from '../middleware/jwt'
const router = express.Router();


router
    .post('/messages', messages.onCreateNewMessages)


export default router;