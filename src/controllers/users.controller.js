import passport from 'passport';
import {
    findAll,
    findById,
    findByEmail,
    createOne,
    updateOne,
    deleteOne,
    saveUserDocumentsService,
    saveUserProfilesService,
    saveUserProductsService
} from "../services/users.services.js";
import CustomError from "../errors/error.generator.js";
import { ErrorMessages } from "../errors/errors.enum.js";
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { logger } from '../utils/logger.js';

export const findUsers = async (req, res) => {
    try {
        const users = await findAll();
        res.status(200).json({ message: "Users", users });
    } catch (error) {
        CustomError.generateError(
            ErrorMessages.USERS_NOT_FOUND,
            500,
            ErrorMessages.USERS_NOT_FOUND
        );
    }
};

export const findUser = async (req, res) => {
        const { idUser } = req.params;
        try {
            const user = await findById(idUser);
            const role = user.role;
            res.status(200).json({ message: "User", user });
        } catch (error) {
            //res.status(500).json({ error: error.message });
            CustomError.generateError(
                ErrorMessages.USER_NOT_FOUND,
                500,
                ErrorMessages.USER_NOT_FOUND
            );
            logger.information("Entro");
        }
};

export const deleteUser = async (req, res) => {
    const { idUser } = req.params;
    const role = user.role;
    if(role === "admin"){
        try {
            await deleteOne(idUser);
            res.status(200).json({ message: "User deleted:" });
        } catch (error) {
            //res.status(500).json({ error: error.message });
            CustomError.generateError(
                ErrorMessages.USER_NOT_DELETED,
                500,
                ErrorMessages.USER_NOT_DELETED
            );
        }
    };
};

export const createUser = async (req, res) => {
    const { first_name, last_name, email, password, username } = req.body;
    if (!first_name || !last_name || !email || !password || !username) {
        return res.status(400).json({ message: "Some data is missing" });
    }
    try {
        const createdUser = await createOne(req.body);
        res.redirect(`/profile/${createdUser._id}`);
    } catch (error) {
        //res.status(500).json({ error: error.message });
        CustomError.generateError(
            ErrorMessages.USER_NOT_CREATED,
            500,
            ErrorMessages.USER_NOT_CREATED
        );
    }
};

export const updateUser = async (req, res) => {
    const { idUser } = req.params;
    const updateData = req.body;
    try {
        const updatedUser = await updateOne(idUser, updateData);
        res.status(200).json({ message: "User updated", user: updatedUser });
    } catch (error) {
        //res.status(500).json({ error: error.message });
        CustomError.generateError(
            ErrorMessages.USER_NOT_UPDATED,
            500,
            ErrorMessages.USER_NOT_UPDATED
        );
    }
};

export const findUserByEmail = async (req, res) => {
            const { email } = req.params;
            try {
                const user = await findByEmail(email);
                res.status(200).json({ message: "User found by email", user });
            } catch (error) {
                //res.status(500).json({ error: error.message });
                CustomError.generateError(
                    ErrorMessages.USER_NOT_FOUND_BY_EMAIL,
                    500,
                    ErrorMessages.USER_NOT_FOUND_BY_EMAIL
                );
            };
};

export const changeRole = async (req, res) => {
    const { idUser } = req.params;
    try {
        const user = await findById(idUser);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const requiredDocuments = ['dni', 'address', 'bank'];
        const uploadedDocuments = user.documents.map(doc => doc.name.toLowerCase());
        const hasAllDocuments = requiredDocuments.every(doc => uploadedDocuments.includes(doc.toLowerCase()));
        if (!hasAllDocuments) {
            return res.status(400).json({ message: "All documents must be uploaded to change role to premium" });
        }
        user.role = user.role === 'user' ? 'premium' : 'user';
        const updatedUser = await user.save();
        res.status(200).json({ message: "User role updated", user: updatedUser });
    } catch (error) {
        console.error("Error changing role:", error);
        CustomError.generateError(
            "Can not update the user",
            500,
            "Can not update the user"
        );
    }
};


export const saveUserDocuments = async (req, res) =>{
    const {idUser} = req.params;
    const {dni, address, bank} = req.files;
    const response = await saveUserDocumentsService({idUser, dni, address, bank});
    res.json({response});
};

export const saveUserProfiles = async (req, res) =>{
    const {idUser} = req.params;
    const {profiles} = req.files;
    const response = await saveUserProfilesService({idUser, profiles});
    res.json({response});
};

export const saveUserProducts = async (req, res) =>{
    const {idUser} = req.params;
    const {products} = req.files;
    const response = await saveUserProductsService({idUser, products});
    res.json({response});
};