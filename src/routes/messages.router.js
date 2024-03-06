import { Router } from "express";
import {
    findMessages,
    createMessage
} from "../controllers/messages.controller.js";
import { avoidMessages } from "../middlewares/avoidMessages.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", findMessages);
router.post("/", avoidMessages(), createMessage);
//router.post("/", authMiddleware(["premium"]), avoidMessages(), createMessage);

export default router;
