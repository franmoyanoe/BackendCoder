import { Schema } from "mongoose";
import mongoose from "mongoose";

const cartSchema = new Schema({
    products: {
        type: [
            {
                id_prod: {
                    type: Schema.Types.ObjectId, //Id autogenerado de MongoDB
                    ref: 'products',
                    //required: true,
                },
                quantity: {
                    type: Number,
                    //required: true //default: 1
                },
            },
        ],
        default: function () {
            return [];
        },
    },
});

cartSchema.pre('find', function () {
    this.populate('products.id_prod')
})

const cartModel = mongoose.model('carts', cartSchema)
export default cartModel

