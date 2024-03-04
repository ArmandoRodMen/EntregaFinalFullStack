import { findById } from "../services/products.services.js";

export const avoidAddToCart = () => {
    return async (req, res, next) => {      
        const {idProduct}  = req.params
        const product = await findById(idProduct)      
            
    try {  
        if ((req.user.role === 'premium') && (product.owner.toString() === req.user._id)) {
            return res.json({message: 'You can not buy this product as you own it'})
        }            
        next();
        } catch (error) {        
            return res.status(401).json({ message: 'Unauthorized error' });        
        }
    };
};


//http://localhost:8080/api/carts/6590ecddc462610925a7e6cc/products/65c3dd2ab08563648a677caf adminCod3r123 adminCoder@coder.com