import { Router } from "express";
import {
    findUsers,
    findUser,
    deleteUser,
    createUser,
    updateUser,
    findUserByEmail,
    changeRole,
    saveUserDocuments,
    saveUserProfiles,
    saveUserProducts
} from "../controllers/users.controller.js";
import upload from "../middlewares/multer.middleware.js";

const router = Router();

router.get("/", findUsers);
router.get("/:idUser", findUser);
router.delete("/:idUser", deleteUser);
router.post("/", createUser);
router.put("/:idUser", updateUser); 
router.get("/email/:email", findUserByEmail); 
router.post("/premium/:idUser", changeRole);
router.post("/:idUser/documents", 
    upload.fields([
        {name: "dni", maxCount: 1},
        {name: "address", maxCount: 1},
        {name: "bank", maxCount: 1}
    ]), 
    saveUserDocuments
);
router.post("/:idUser/profiles", 
    upload.fields([
        {name: "profiles", maxCount: 1}
    ]), 
    saveUserProfiles
);
router.post("/:idUser/products", 
    upload.fields([
        {name: "products", maxCount: 3}
    ]), 
    saveUserProducts
);


export default router;
