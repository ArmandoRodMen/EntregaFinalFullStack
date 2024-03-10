import { Router } from "express";
import { messagesDao } from "../DAL/DAO/mongodb/messages.dao.js";
import { usersDao } from "../DAL/DAO/mongodb/users.dao.js";
import { productsDao } from "../DAL/DAO/mongodb/products.dao.js";
import { cartsDao } from "../DAL/DAO/mongodb/carts.dao.js";
import { compareData, hashData } from "../utils.js";

const router = Router();

router.get("/chat", async (req,res)=>{
  if(!req.session.user){
    res.redirect(`/login`);
  }else{
    const idUser = req.session.user.id;
    const username = req.session.user.username;
    const cart = req.session.user.cart;
    const role = req.session.user.role
    const messages = await messagesDao.findAll();
    res.render("chat", {idUser, username, idCart:cart, role, messages});
  }
});

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

router.get("/profile/:idUser", async (req, res) => {
  if(!req.session.user){
    res.redirect(`/login`);
  }else{
    const { idUser } = req.params;
    const user = await usersDao.findById(idUser);
    const products = await productsDao.findAll();
    const { first_name, last_name, username } = user;
    res.render("profile", { first_name, last_name, username, products });
  }
});

router.get("/restaurar",(req, res) =>{
  res.render("restaurar");
});

router.get("/documents", (req, res)=>{
  res.render("documents");
});

router.get("/reset/:token", async (req, res) => {
  const { token } = req.params;
  res.render("reset", { token });
});

router.get("/reset", async(req, res) =>{
  res.render("signup");
})

export default router;
