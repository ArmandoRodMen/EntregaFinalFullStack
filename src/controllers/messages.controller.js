import passport from 'passport';
import {
    findAll,
    createOne
} from "../services/messages.services.js";
import CustomError from "../errors/error.generator.js";
import { ErrorMessages } from "../errors/errors.enum.js";
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { logger } from '../utils/logger.js';

export const findMessages = async (req, res) => {
    try {
        const messages = await findAll(res);
        res.render('chat', { messages });
    } catch (error) {
        CustomError.generateError(
            ErrorMessages.CAN_NOT_FIND_MESSAGES,
            500,
            ErrorMessages.CAN_NOT_FIND_MESSAGES
        );
    }
};

export const createMessage = async (req, res) => {
    const { username, message} = req.body;
    logger.information("/////////\n",username,message);
    if (!message) {
        CustomError.generateError(
            ErrorMessages.BAD_DATA,
            400,
            ErrorMessages.BAD_DATA
        );
    }
};
