import { productsService } from "../repositoryServices/index.js";

export const avoidDeletion = () => {
    return async (req, res, next) => {      
        try {      
            const { pid } = req.params
            const product = await productsService.findProdById(pid)
            if ((req.user.role === 'premium') && (product.owner != req.user._id)) {
                return res.status(403).json({message: 'You cant delete a product that you dont own'})
            }                        
            next();
            } catch (error) {
                return res.status(401).json({ message: 'Unauthorized error' });
            }
    };
};



