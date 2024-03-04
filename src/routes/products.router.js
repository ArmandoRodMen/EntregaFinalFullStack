import { Router } from "express";
import {
  findProductAggregation,
  findProductById,
  updateProductById,
  createProduct,
  deleteProduct,
  saveProduct
} from "../controllers/products.controller.js";
import upload from "../middlewares/multer.middleware.js";
const router = Router();

router.get("/", findProductAggregation);
router.get("/:idProduct", findProductById);
router.put("/:idProduct", updateProductById);
router.post("/", createProduct);
router.delete("/:idProduct", deleteProduct);
/*router.post("/documents",     upload.fields([
  {name: "profiles", maxCount: 3},

  ]), 
saveProduct);*/

export default router;