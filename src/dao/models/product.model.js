import mongoose from "mongoose";


const productoSchema = new mongoose.Schema({
   title: {
          type: String,
          required: true
    },

  description: {
          type: String,
          required: true
    },

  price: {
        type: Number,
        required: true
  },

  img: {
    type: String,
    
},

code: {
    type: String,
    required: true
},

stok: {
    type: String,
    required: true
},

category: {
    type: String,
    required: true
},

status: {
    type: String,
    required: true
},

thumbnails: {
    type: String,
    required: true
}

}) 

const ProductModel = mongoose.model("products", productoSchema);

export default ProductModel; 