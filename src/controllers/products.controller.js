import passport from 'passport';
import {
    findAll,
    findAggregation,
    findById,
    createOne,
    deleteOne,
    updateOne,
    findOwnerById,
    saveProductService
} from "../services/products.services.js";
import CustomError from "../errors/error.generator.js";
import { ErrorMessages } from "../errors/errors.enum.js";
import { transporter } from '../utils/nodemailer.js';
import { logger } from '../utils/logger.js';


export const findAllProducts = async (req, res) =>{
    try{
        const allProducts = await findAll();
        res.status(200).json({message: "Products", allProducts});
    }catch(error){
        CustomError.generateError(
            ErrorMessages.CAN_NOT_FIND_PRODUCTS,
            500,
            ErrorMessages.CAN_NOT_FIND_PRODUCTS
        );
    }
};


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
    };
    
export const deleteProduct = async (req, res) => {
    const { idProduct } = req.params;
    try {
        const product = await findById(idProduct);
        if (!product) {
            return res.status(404).json({ message: "No product found with that id" });
        }
        if (!idProduct) {
            return res.status(404).json({ message: "No product found with that id" });
        }
        const owner = await findOwnerById(product.owner); // Asumiendo que tienes una función para encontrar al propietario por su ID
        if (!owner) {
            return res.status(404).json({ message: "Owner not found" });
        }
        if (owner.role === 'premium') {
            const mailOptions = {
                from: "Armando Ecommerce",
                to: owner.email, 
                subject: "Información importante sobre tu producto",
                html: `
                    <h1>Información importante</h1>
                    <p>Hola ${owner.first_name},</p>
                    <p>Queremos informarte que uno de tus productos ha sido eliminado de nuestra plataforma.</p>
                    <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en ponerte en contacto con nuestro equipo de soporte.</p>
                    <p>Atentamente,<br>El equipo de Ecommerce</p>
                `
            };
            await transporter.sendMail(mailOptions);
            logger.information("Mail enviado al propietario premium: ");
        }
        await deleteOne(idProduct);
        res.status(200).json({ message: "Product deleted" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error al eliminar el producto." });
        }
    };
    

export const updateProductById = async (req, res) => {
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
    };
