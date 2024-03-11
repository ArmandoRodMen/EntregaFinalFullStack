import { messagesDao } from "../DAL/DAO/mongodb/messages.dao.js";
import { logger } from "../utils/logger.js";

/*
export const findAll = async () => {
    try {
        const messages = await messagesDao.findAll();
        return messages; 
    } catch (error) {
        logger.error("Error finding messages");
        throw error; // Propagar el error
    }
};
export const createOne = async (messageData) => {
    const { username, message } = messageData; 
    if (!username || !message) {
        throw new Error("Username and message are required");
    }
    try {
        const newMessage = await messagesDao.createOne(messageData);
        return newMessage; 
    } catch (error) {
        logger.error("Error creating messages");
        throw error; // Propagar el error para manejarlo más arriba en la cadena
    }
};
*/
class MessagesServices {
    async findAll() {
        const result = await messagesDao.findAll().lean();
        return result;
    }

    async createOne(messageData) {
        console.log(messageData);
        const result = await messagesModel.create(messageData);
        return result;
    }  
}

export const messagesServices = new MessagesServices();
