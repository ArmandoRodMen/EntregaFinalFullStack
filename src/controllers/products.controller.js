import passport from 'passport';
import {
    findAggregation,
    findById,
    createOne,
    deleteOne,
    updateOne,
    saveProductService
} from "../services/products.services.js";
import CustomError from "../errors/error.generator.js";
import { ErrorMessages } from "../errors/errors.enum.js";
import { authMiddleware } from '../middlewares/auth.middleware.js';

    export const findProductAggregation = async (req, res) => {
        console.log(req.query);
        try {
            const products = await findAggregation(req.query);
            res.status(200).json({ message: "Products found", products });
        } catch (error) {
            CustomError.generateError(
                ErrorMessages.CAN_NOT_FIND_AGGREGATION,
                500,
                ErrorMessages.CAN_NOT_FIND_AGGREGATION
            );
        }
    };
    
    export const findProductById = async (req, res) => {
        const { idProduct } = req.params;
        try {
            const product = await findById(idProduct);
            if (!product) {
                return res.status(404).json({ message: "No product found with that id" });
            }
            res.status(200).json({ message: "Product found", product });
        } catch (error) {
            CustomError.generateError(
                ErrorMessages.CAN_NOT_FIND_PRODUCT_BY_ID,
                500,
                ErrorMessages.CAN_NOT_FIND_PRODUCT_BY_ID
            );
        }
    };
    
    export const createProduct = async (req, res) => {
        //passport.authenticate('jwt', { session: false })(req, res, async () => {
            //authMiddleware(['admin', 'premium'])(req, res, async () => {
                const { title, description, code, price, stock } = req.body;
                console.log("Entrando a create product",req.body);
                if (!title || !description || !code || !price) {
                    return res.status(400).json({ message: "Required data is missing" });
                }
    
                try {
                    const newProduct = await createOne(req.body);
                    res.status(201).json({ message: "Product created", product: newProduct });
                    /*
                    const userId = req.user._id;  // Obtén el _id del usuario desde el token JWT
    
                    // Verifica si el usuario tiene el rol "premium"
                    const user = await usersModel.findById(userId);
                    if (user && user.role === 'premium') {
                        // Crea el producto y establece el "owner" como el _id del usuario
                        const newProduct = await createOne({ ...req.body, owner: userId });
    
                        res.status(201).json({ message: "Product created", product: newProduct });
                    } else {
                        res.status(403).json({ error: "El usuario no tiene permisos para crear productos premium." });
                    }
                    */
                } catch (error) {
                    // Maneja el error adecuadamente
                    console.error(error);
                    res.status(500).json({ error: "Error al crear el producto." });
                }
            //});
        //});
    };
    
    export const deleteProduct = async (req, res) => {
        //owner === premium => nodemailer
        //passport.authenticate('jwt', { session: false })(req, res, async () => {
            //authMiddleware(['admin', 'premium'])(req, res, async () => {
                const { idProduct } = req.params;
                //const userId = req.user._id;  // Obtén el _id del usuario desde el token JWT
    
                try {
                    // Verifica si el producto existe
                    const product = await findById(idProduct);
                    if (!product) {
                        return res.status(404).json({ message: "No product found with that id" });
                    }
                    /*
                    // Verifica si el usuario tiene permisos para eliminar el producto
                    if (req.user.role === 'admin' || (req.user.role === 'premium' && product.owner.toString() === userId.toString())) {
                        await deleteOne(idProduct);
                        res.status(200).json({ message: "Product deleted" });
                    } else {
                        res.status(403).json({ error: "El usuario no tiene permisos para eliminar este producto." });
                    }
                    */
                    if (!idProduct) {
                        return res.status(404).json({ message: "No product found with that id" });
                    }
                    await deleteOne(idProduct);
                    res.status(200).json({ message: "Product deleted" });
                } catch (error) {
                    // Maneja el error adecuadamente
                    console.error(error);
                    res.status(500).json({ error: "Error al eliminar el producto." });
                }
            //});
        //});
    };
    

    export const updateProductById = async (req, res) => {
        //passport.authenticate('jwt', { session: false })(req, res, async () => {
            //authMiddleware(['admin', 'premium'])(req, res, async () => {
                const { idProduct } = req.params;
                const obj = req.body;
                //const userId = req.user._id;  // Obtén el _id del usuario desde el token JWT
                try {
                    if (!idProduct) {
                        return res.status(404).json({ message: "No product found with that id" });
                    }
                    // Verifica si el producto existe
                    const product = await findById(idProduct);
                    if (!product) {
                        return res.status(404).json({ message: "No product found with that id" });
                    }
                    await updateOne(idProduct, obj); // Puedes pasar los nuevos datos a la función de actualización
                    res.status(200).json({ message: "Product updated" });
                    /*
                    // Verifica si el usuario tiene permisos para actualizar el producto
                    if (req.user.role === 'admin' || (req.user.role === 'premium' && product.owner.toString() === userId.toString())) {
                        await updateOne(idProduct, req.body); // Puedes pasar los nuevos datos a la función de actualización
                        res.status(200).json({ message: "Product updated" });
                    } else {
                        res.status(403).json({ error: "El usuario no tiene permisos para actualizar este producto." });
                    }
                    */
                } catch (error) {
                    // Maneja el error adecuadamente
                    console.error(error);
                    res.status(500).json({ error: "Error al actualizar el producto." });
                }
            //});
        //});
    };

    export const saveProduct = async (req, res) =>{
        const { idProduct } = req.params;
        const { title, description, code, price, stock, thumbnail } = req.body;
        console.log("\n///////////\n", idProduct);
        const response = await saveProductService({idProduct, title, description, code, price, stock, thumbnail});
        res.json({response});
    };