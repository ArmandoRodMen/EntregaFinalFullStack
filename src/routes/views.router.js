import { Router } from "express";
import { messagesDao } from "../DAL/DAO/mongodb/messages.dao.js";
import { usersDao } from "../DAL/DAO/mongodb/users.dao.js";
import { productsDao } from "../DAL/DAO/mongodb/products.dao.js";
import { cartsDao } from "../DAL/DAO/mongodb/carts.dao.js";
import { transporter } from "../utils/nodemailer.js";
import bcrypt from "bcrypt";
import { compareData, hashData } from "../utils.js";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/chat", async (req,res)=>{
  if(!req.session.user){
    res.redirect(`/login`);
  }else{
    const username = req.session.user.username;
    const role = req.session.user.role
    const messages = await messagesDao.findAll();
    res.render("chat", { username, role, messages});
  }
});

router.get("/products", async (req, res) => {
  const logOut = req.session.user.id
  const products = await productsDao.findAggregation(req.query);
  res.render("products", { products: products, idUser: logOut });
});

router.get("/cart/:idCart", async (req, res) => {
  const {idCart} = req.params;
  const cartProducts = await cartsDao.findProductsInCart(idCart);
  res.render("cart", {idCart, products:cartProducts} );
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

router.get("/profile",(req, res)=>{
  if (!req.session.passport){
    return res.redirect("/login");
  }
  const {username} = req.user;
  res.render("profile", {username});
});

router.get("/restaurar",(req, res) =>{
  res.render("restaurar");
});

router.get("/documents", (req, res)=>{
  res.render("documents");
});

router.get("/admin", (req,res)=>{
  res.render("admin");
});

router.post("/restaurar", async (req, res) => {
  const { email } = req.body;
  const user = await usersDao.findByEmail(email);

  if (user != null) {
    // Set the expiration time to one hour from now
    const expirationTime = Date.now() + 3600000;

    // Generate a random number and convert it to a string
    const randomNumber = Math.floor(Math.random() * 1000000);
    const stringNumber = randomNumber.toString();

    await user.save();

    // Generate a hash of the token
    const hashedToken = await bcrypt.hash(stringNumber, 10);

    // Convert the hashedToken to hexadecimal
    let token = Buffer.from(hashedToken, 'binary').toString('hex');
    token = token.slice(0, 13);

    user.resetToken = token;
    user.resetTokenExpiration = expirationTime;

    // Update the user's record with the reset token hash and expiration time
    await usersDao.updatePasswordResetToken(email, token, expirationTime);

    // Construct the reset link to be included in the email
    const resetLink = `http://localhost:8080/reset/${token}`;

    const mailOptions = {
      from: "Armando Ecommerce",
      to: email,
      subject: "Restaurar contraseña",
      html: `
        <h1>Un saludo desde Armando Ecommerce</h1>
        <p>Hola,</p>
        <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
        <a href="${resetLink}">Restablecer Contraseña</a>
        <p>Este enlace expirará en 1 hora.</p>
        <p>Atentamente,<br>El equipo de Ecommerce</p>
      `,
    };

    // Send the email with the reset link
    await transporter.sendMail(mailOptions);
    res.redirect("/login");
  } else {
    res.redirect("/login");
  }
});

router.get("/reset/:token", async (req, res) => {
  const { token } = req.params;
  // Render the reset.handlebars template with the token parameter
  res.render("reset", { token });
});

router.get("/reset", async(req, res) =>{
  res.render("signup");
})

router.post("/reset/:token", async (req, res) => {
  const { password, confirmPassword } = req.body;
  const { token } = req.params;
  const user = await usersDao.findByResetToken(token);
  if (user && user.resetTokenExpiration > Date.now()) {
    try {
      const hashedPassword = await hashData(password);
      const isPasswordInValid = await compareData(hashedPassword, user.password);
      if(!isPasswordInValid){
        console.log("anterior password",user.password);
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();
        console.log("nuevo password",user.password);
        return res.redirect("/login");
      };
    } catch (error) {
      console.error("Error al guardar la nueva contraseña:", error);
      return res.render("reset", { error: "Error al restablecer la contraseña", token });
    }
  }
  res.render("reset", { error: "Token no válido o expirado", token });
});

export default router;
