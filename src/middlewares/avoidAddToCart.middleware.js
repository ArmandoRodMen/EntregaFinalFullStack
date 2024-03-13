import { findById as findProductById } from "../services/products.services.js";
import { findByIdCart } from "../services/users.services.js";
import { findCartById } from "../services/carts.services.js";
import { logger } from "../utils/logger.js";

export const avoidAddToCart = () => {
    return async (req, res, next) => {      
        const { idProduct, idCart } = req.params;
        try {
            const product = await findProductById(idProduct);
            const cart = await findCartById(idCart);
            const user = await findByIdCart(idCart);
            const userCart = user.cart;
            if (user.role === "admin") {
                return res.status(403).json({ message: 'Only role users & premium can buy products' });
            }
            if (product.owner === user.id) {
                return res.json({ message: 'You can not buy this product as you own it' });
            }
            next();
        } catch (error) { 
            logger.error("error: ", error);       
            return res.status(401).json({ message: 'Unauthorized error' });        
        }
    };
};
