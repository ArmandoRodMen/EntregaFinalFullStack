import config from "../config.js";
import jwt from "jsonwebtoken";

const SECRET_KEY_JWT = config.SECRET_KEY_JWT;

export const authMiddleware = (roles) => {

    return (req, res, next) => {
        let token = req.headers.authorization?.split(' ')[1];
        if (!token && req.cookies) {
            token = req.cookies.token; 
        }
        if (!token) {
            console.log("token", token, "req.cookies: ", req.cookies," ", SECRET_KEY_JWT);
            return res.status(401).json({ message: 'Unauthorized: no hay usuario con token' });
        }
        try {      
            const decoded = jwt.verify(token, SECRET_KEY_JWT);
            req.user = decoded;
                console.log(req.user.role, "estamos aca dentro")
        if (roles && !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Your role is not authorized' });
        }
        next();
        } catch (error) {
            return res.status(401).json({ message: 'Unauthorized error' });
        }
    };
};



