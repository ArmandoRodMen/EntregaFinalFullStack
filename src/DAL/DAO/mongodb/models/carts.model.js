// En tu archivo carts.model.js
import mongoose from "mongoose";

const cartsSchema = new mongoose.Schema({
    /*
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user',
        default: new mongoose.Types.ObjectId('65ebd68d1b17e2fc0913242e'),
        required: true
    },
    */
    products: [
        {
            product: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: "products",
            },
            quantity: {
                type: Number,
            },
            _id: false, 
        },
    ],
});

export const cartsModel = mongoose.model("carts", cartsSchema);
