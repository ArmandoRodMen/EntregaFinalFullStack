import { Router } from "express";
import { usersDao } from "../DAL/DAO/mongodb/users.dao.js";
import { hashData, compareData, generateToken } from "../utils.js";
import passport from "passport";
import { transporter } from "../utils/nodemailer.js";
import { logger } from "../utils/logger.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/signup", passport.authenticate("signup"), async (req, res) => { // :)
    const { first_name, last_name, email, password, username } = req.body;
    const mailOptions = {
        from: "Armando Ecommerce",
        to: email, 
        subject: "Bienvenido Coder",
        html: `
            <h1>Bienvenido a Armando Ecommerce</h1>
            <p>Hola ${first_name},</p>
            <p>Gracias por unirte a nuestra plataforma. Estamos emocionados de tenerte como parte de nuestra comunidad.</p>
            <p>¡Explora nuestro catálogo y descubre las increíbles ofertas que tenemos para ti!</p>
            <p>Si tienes alguna pregunta o necesitas ayuda, no dudes en ponerte en contacto con nuestro equipo de soporte.</p>
            <p>¡Que tengas una excelente experiencia de compra!</p>
            <p>Atentamente,<br>El equipo de Ecommerce</p>
        `
    };
    if (!first_name || !last_name || !email || !password || !username) {
        return res.status(400).json({ message: "Some data is missing" });
    }
    try {
        const hashedPassword = await hashData(password);
        const existingUser = await usersDao.findByEmail(email);
        const redirectUrl = `/login`;
        if (existingUser) {
            return res.redirect(redirectUrl);
        }
        const createdUser = await usersDao.createOne({ ...req.body, password: hashedPassword });
        await transporter.sendMail(mailOptions);
        res.redirect(redirectUrl);
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.post("/login", passport.authenticate("login"),  async (req, res) => { // :)
    const { email, password } = req.body;
    const redirectUrl = "/products";
    if (!email || !password) {
        return done(null, false, {message: "Some data is missing"});
    }
    try {
        const user = await usersDao.findByEmail(email);
        if (!user) {
            return done(null, false, {message: "Username is not valid"});
        }
        const isPasswordValid = await compareData(password, user.password);
        if (!isPasswordValid) {
            return done(null, false, {message: "Password is not valid"});
        }
        const userId = user.id;
        await usersDao.updateOne({ _id: userId }, { lastConnection: Date.now() });
        const {first_name, last_name, role, cart} = user; 
        const token = generateToken({first_name, last_name, email, role});
        req.session.user = {id: userId, email, first_name: user.first_name, username: user.username, role: user.role, token, cart};
        res.redirect(redirectUrl);
    } catch (error) {
        logger.error(error);
    }
});

router.get(
    "/current", async(req,res) =>{
        if(req.session.user.role){
            const role = req.session.user.role;
            const idUser = req.session.user.id;
            const idCart = req.session.user.cart;
            res.render("current", {role, idUser, idCart});
        }
    }
);

    // SIGNUP - LOGIN - PASSPORT GITHUB
    router.get(
        "/auth/github",
        passport.authenticate("github", { scope: ["user:email"] })
    );
    router.get(
        "/callback", passport.authenticate("github"), (req, res) => {
        res.redirect("/products");
    });

    // SIGNUP - LOGIN - PASSPORT GOOGLE
    router.get(
        '/auth/google',
        passport.authenticate('google', { scope:[ 'email', 'profile' ] })
    );

    router.get( 
        '/auth/google/callback',
        passport.authenticate( 'google', { failureRedirect: '/error'}),
        (req, res)=>{
            res.redirect("/products");
        }
        );

router.get("/:idUser/signout", async (req, res) => {
    const { idUser } = req.params;
    logger.information("signout", idUser);
    try {
        await usersDao.updateOne({ _id: idUser }, { lastConnection: Date.now() });
        req.session.destroy((error) => {
            if (error) {
                logger.error("Error during session destruction:", error);
            }
            res.clearCookie();
            res.redirect("/login");
        });
    } catch (error) {
        logger.error("Error updating lastConnection in signout:", error);
        req.session.destroy(() => {
            res.clearCookie();
            res.redirect("/login");
        });
    }
});

router.post("/restaurar", async (req, res) => {
    const { email } = req.body;
    const user = await usersDao.findByEmail(email);

    if (user != null) {
        const expirationTime = Date.now() + 3600000;
        const randomNumber = Math.floor(Math.random() * 1000000);
        const stringNumber = randomNumber.toString();
        await user.save();
        const hashedToken = await bcrypt.hash(stringNumber, 10);
        let token = Buffer.from(hashedToken, 'binary').toString('hex');
        token = token.slice(0, 13);
        user.resetToken = token;
        user.resetTokenExpiration = expirationTime;
        await usersDao.updatePasswordResetToken(email, token, expirationTime);
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
        await transporter.sendMail(mailOptions);
        res.redirect("/signup");
    } else {
        res.redirect("/signup");
    }
});

router.post("/reset/:token", async (req, res) => {
    const { password, confirmPassword } = req.body;
    const { token } = req.params;
    const user = await usersDao.findByResetToken(token);
    if (user && user.resetTokenExpiration > Date.now()) {
        try {
            const hashedPassword = await hashData(password);
            const isPasswordInValid = await compareData(hashedPassword, user.password);
            if(!isPasswordInValid){
            user.password = hashedPassword;
            user.resetToken = undefined;
            user.resetTokenExpiration = undefined;
            await user.save();
            return res.redirect("/signup");
            };
        } catch (error) {
            console.error("Error al guardar la nueva contraseña:", error);
            return res.render("reset", { error: "Error al restablecer la contraseña", token });
        }
    }
    res.render("reset", { error: "Token no válido o expirado", token });
});

export default router;
