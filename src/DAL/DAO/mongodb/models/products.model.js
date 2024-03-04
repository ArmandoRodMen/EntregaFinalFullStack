import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsSchema = new mongoose.Schema({
    title:{
        type: String,
    },
    description:{
        type: String,
    },
    price:{
        type: Number,
    },
    thumbnail:{
        type: [
            {
                name: String,
                reference: String
            },
        ],
        default: []
    },
    code:{
        type: String,
    },
    stock:{
        type: Number,
        default: 0
    },
    category:{
        type: String,
    },
    statues:{
        type: Boolean,
        default: true,
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
        default: '6590ecddc462610925a7e6ce'
    }
});

productsSchema.plugin(mongoosePaginate);

export const productsModel = mongoose.model("products", productsSchema);