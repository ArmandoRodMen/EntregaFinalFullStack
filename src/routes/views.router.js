import { Router } from "express";
import { messagesDao } from "../DAL/DAO/mongodb/messages.dao.js";
import { productsDao } from "../DAL/DAO/mongodb/products.dao.js";
import { cartsDao } from "../DAL/DAO/mongodb/carts.dao.js";
import { findAll } from "../services/users.services.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
const router = Router();

router.get("/chat", async (req,res)=>{
  if(!req.session.user){
    res.redirect(`/login`);
  }else{
    const idUser = req.session.user.id;
    const username = req.session.user.username;
    const cart = req.session.user.cart;
    const role = req.session.user.role;
    const email = req.session.user.email;
    const messages = await messagesDao.findAll();
    res.render("chat", {idUser, username, idCart:cart, role, messages, email});
  }
});

router.get("/admin", 
  authMiddleware(["admin"]), 
  async (req, res)=>
  {
  try {
      const users = await findAll();
      const simplifiedUsers = users.map(user => ({
          idUser: user._id,
          first_name: user.first_name,
          username: user.username,
          email: user.email,
          role: user.role,
          cart: user.cart
      }));
      res.render("admin", {user:simplifiedUsers});
  } catch (error) {
    res.status(500).send(error.message);
  }});

router.get("/products", async (req, res) => {
  const idUser = req.session.user.id;
  const username = req.session.user.username;
  const cart = req.session.user.cart;
  const products = await productsDao.findAll();
  res.render("products", { idUser, username, products, idCart:cart});
});

router.get("/cart/:idCart", async (req, res) => {
  const {idCart} = req.params;
  const idUser = req.session.user.id;
  const products = await cartsDao.findProductsInCart(idCart);
  res.render("cart", {idCart, idUser, products});
});

router.get("/signup", (req, res) => {
  if(req.session.user){
    res.redirect(`/products`);
  }else{
    res.render("signup");
  }
});

router.get("/login", async (req, res) => {
  if(req.session.user){
    res.redirect(`/products`);
  }else{
    res.render("login");
  }
});

router.get("/restaurar",(req, res) =>{
  res.render("restaurar");
});

router.get("/documents", (req, res)=>{
  const idUser = req.session.user.id;
  const username = req.session.user.username;
  const cart = req.session.user.cart;
  const role = req.session.user.role;
  const email = req.session.user.email;
  res.render("documents", {idUser, username, idCart:cart, role, email});
});

router.get("/reset/:token", async (req, res) => {
  const { token } = req.params;
  res.render("reset", { token });
});

router.get("/reset", async(req, res) =>{
  res.render("signup");
})

export default router;
