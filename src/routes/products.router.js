import { Router } from "express";
import {
  findAllProducts,
  findProductAggregation,
  findProductById,
  updateProductById,
  createProduct,
  deleteProduct
} from "../controllers/products.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import passport from "passport";
const router = Router();

router.get("/", findAllProducts);
router.post("/", authMiddleware(["premium", "admin"]),createProduct);
router.get("/:idProduct", findProductById);
router.put("/:idProduct", authMiddleware(["admin"]), updateProductById);
router.delete("/:idProduct", authMiddleware(["premium", "admin"]), deleteProduct);

export default router;