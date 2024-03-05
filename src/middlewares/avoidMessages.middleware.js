export const avoidMessages = () => {
    return async (req, res, next) => {      
        const {user, role}  = req.params
    try {  
        if ((role === 'premium')){
            return res.json({message: 'Only role users can send messages'})
        }            
        next();
        } catch (error) {        
            return res.status(401).json({ message: 'Unauthorized error' });        
        }
    };
};
