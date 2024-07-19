import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId;
                ref: "Product",
                required: true
            },
            quantity: {
                type: Number,
                required: true
          }
        }

    ]
})

const cartModel = mongoose.model("carts", cartSchema);

export default cartModel;