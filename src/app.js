import express from "express";

import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import usersRouter from "./routes/users.router.js";
import { __dirname } from "./utils.js";
import viewsRouter from "./routes/views.router.js";
//import messageRouter from "./routes/messages.router.js";
import cookieRouter from "./routes/cookie.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import session from "express-session";
import "./passport.js";
import passport from "passport";
import fileStore from "session-file-store";
const FileStore = fileStore(session);
import MongoStore from "connect-mongo";
import "../src/DAL/DAO/fs/db/configDB.js";
import config from "./config.js";
import cors from "cors";
import { generateProuct } from "./faker.js";
import { errorMiddleware } from "./middlewares/errors.middleware.js";
import { logger } from "./utils/logger.js";
import { swaggerSetup } from "./utils/swagger.js";
import swaggerUi from "swagger-ui-express";
import {join} from "path";
import { Server } from "socket.io";
import { messagesDao } from "./DAL/DAO/mongodb/messages.dao.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));
app.use(cors({
        origin: ['http://localhost:8080'],
        credentials: true
    }));

const URI = config.MONGO_URI;

//mongo
//const URI = "mongodb+srv://ArmandoRod:coderhouse@cluster0.yl8erzs.mongodb.net/ecommerce?retryWrites=true&w=majority";

//sessions
app.use(
    session({
        store: new MongoStore({
            mongoUrl: URI,
        }), 
        secret: "secretSession", 
        cookie:{maxAge:86400*1000},
    })
);

//passport
app.use(passport.initialize());
app.use(passport.session());


app.engine("handlebars", handlebars.engine());
app.set("views", join(__dirname, "views"));
app.set("view engine", "handlebars");

app.use("/api/sessions", sessionsRouter);
app.use("/api/products", productsRouter);
app.use("/api/cookie", cookieRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/users", usersRouter);
app.use("/", viewsRouter);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSetup)); // :)
app.use(errorMiddleware);

app.get("/mockingproducts",(req, res) =>{ // :)
    const products = [];
    for (let i=0; i<100; i++) {
        const product = generateProuct();
        products.push(product);
    }
    res.json({products});
});

app.get("/loggerTest", (req, res) => { // :)
    logger.debug("Prueba debug");
    logger.http("Prueba http");
    logger.information("Prueba information"); 
    logger.warning("Prueba warning");
    logger.error("Prueba error");
    logger.fatal("Prueba de Error");
    res.send("Logger test completed");
});

const httpServer = app.listen(8080, () => {
    logger.information("Escuchando puerto 8080 con logger");
});

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
    logger.information(`Nueva detección: ${socket.id}`);
    
    socket.on("newUser", (username) => { 
        logger.information(`Cliente conectado: ${username}`);
        socket.broadcast.emit("userConnected", username);
        socket.emit("connected");
    });

    socket.on("message", async (messageData) => {
        try {
            await messagesDao.createOne(messageData);
            let allMessages = await messagesDao.findAll();
            socketServer.emit("chat", allMessages);
        } catch (error) {
            console.error("Error handling message event:", error);
        }
    });
});