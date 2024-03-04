import { logger } from "../utils/logger.js";

export const errorMiddleware = (error, req, res, next) =>{
    logger.error(error);
    res
        .status(error.code || 500)
        .json({message: error.message, name: error.name});
}