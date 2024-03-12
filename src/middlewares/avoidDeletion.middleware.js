import {
    findAll,
    findAggregation,
    findById,
    createOne,
    deleteOne,
    updateOne,
    findOwnerById,
    saveProductService
} from "../services/products.services"; 

export const avoidDeletion = () => {
    return async (req, res, next) => {      
        try {      
            const { idProduct } = req.params
            const product = await findById(idProduct)
            if ((req.user.role === 'premium') && (product.owner != req.user._id)) {
                return res.status(403).json({message: 'You cant delete a product that you do not own'})
            }                        
            next();
            } catch (error) {
                return res.status(401).json({ message: 'Unauthorized error' });
            }
    };
};



