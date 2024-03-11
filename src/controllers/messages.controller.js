/*
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

export const createMessage = async (infoMessage) => {
    const { username, message } = infoMessage;

    if (!username || !message) {
        return res.status(400).send({ error: 'Username and message are required.' });
    }

    try {
        const newMessage = await createOne({ username, message }); // Asume que esta función está definida para tomar un objeto con username y message
        logger.information(newMessage);
    } catch (error) {
        logger.error({ error: 'Error creating the message.' });
    }
};
*/