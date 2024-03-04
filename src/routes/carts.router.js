import { Router } from "express";
import {
    createNewCart,
    findCart,
    addProduct,
    getProductsInCart,
    getProductInCart,
    updateProductQuantity,
    removeProductFromCart,
    removeAllProductsFromCart,
    updateAllProductsInCart,
    getAllCartsData,
    removeCartById,
    getTotal
} from "../controllers/carts.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { avoidAddToCart } from "../middlewares/avoidAddToCart.middleware.js";

const router = Router();

router.get("/", getAllCartsData);
router.post("/", createNewCart);

router.get("/:idCart", findCart);
router.post("/:idCart/products/:idProduct", authMiddleware(["user", "premium"]), avoidAddToCart(), addProduct);
router.get("/:idCart/products", getProductsInCart);
router.get("/:idCart/products/:idProduct", getProductInCart );
router.put("/:idCart/products/:idProduct", updateProductQuantity);
router.delete("/:idCart/products/:idProduct", removeProductFromCart);
router.delete("/:idCart", removeAllProductsFromCart);
router.put("/:idCart", updateAllProductsInCart);
router.delete("/:idCart", removeCartById);
router.get("/:idCart/purchase", getTotal);

export default router;
