import jwt from "jsonwebtoken";
const SECRET_KEY_JWT = "secretJWT";
import { logger } from "../utils/logger.js";

export const jwtValidation = (req, res, next)=>{
    try{
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: Token missing" });
        }
        const userToken = jwt.verify(token, SECRET_KEY_JWT);
        req.user = userToken;
        next();
    }catch(error){
        logger.error("JWT Validation Error:", error);
        res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
}

