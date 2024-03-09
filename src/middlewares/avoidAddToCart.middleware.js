import { findById as findProductById } from "../services/products.services.js";
import { findById as findUserById } from "../services/users.services.js";
import { findCartById } from "../services/carts.services.js";

export const avoidAddToCart = () => {
    return async (req, res, next) => {      
        const { idProduct, idCart } = req.params;

        try {
            const product = await findProductById(idProduct);
            const cart = await findCartById(idCart);
            const user = await findUserById(cart.owner);
            if (user.role != "user") {
                return res.status(403).json({ message: 'Only user roles can buy products' });
            }
            if (user.cart.toString() !== idCart) {
                return res.status(403).json({ message: 'This cart does not belong to the authenticated user.' });
            }
            if (product.owner.toString() === cart.owner.toString()) {
                return res.json({ message: 'You cannot buy this product as you own it' });
            }
            next();
        } catch (error) { 
            console.log("error: ", error);       
            return res.status(401).json({ message: 'Unauthorized error' });        
        }
    };
};


//http://localhost:8080/api/carts/6590ecddc462610925a7e6cc/products/65c3dd2ab08563648a677caf adminCod3r123 adminCoder@coder.com