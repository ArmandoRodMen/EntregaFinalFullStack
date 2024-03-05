import { Router } from "express";
import {
    viewCookie,
} from "../controllers/cookie.controller.js"

const router = Router();
router.get("/view", viewCookie);

export default router;



//Cookie
/*
router.post("/", (req, res) =>{
    const {email} = req.body;
    res.cookie("user", email,{maxAge:10000}).send("Cookie created");
});*/
