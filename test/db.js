import mongoose from "mongoose";

mongoose.connect(
    "mongodb+srv://ArmandoRod:coderhouse@cluster0.yl8erzs.mongodb.net/ecommerce?retryWrites=true&w=majority"
)
.then(()=> console.log("Conectado a la base de datos"))
.catch(error => console.log(error));