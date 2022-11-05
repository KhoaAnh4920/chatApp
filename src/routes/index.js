import express from 'express';
// middlewares
import { encode } from '../middleware/jwt';

const router = express.Router();

router
    .post('/login', encode, (req, res, next) => {
        return res
            .status(200)
            .json({
                success: true,
                errorCode: 200,
                error: {},
                data: {
                    access_token: req.authToken,
                    userInfo: req.userInfo
                }

            });
    });

export default router;