const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true, //to remove spaces 
        required: true,
        maxlength: 52
    },
    description: {
        type: String,
        maxlength: 2000
    },
    price: {
        type: Number,
        trim: true, //to remove spaces 
        required: true,
        maxlength: 32
    },
    category: {
        type: ObjectId, // when we refer to product category it will 
        // refer to category id
        ref: "category",
        required: true
    },
    quantity: {
        type: Number
    },
    sold :{
        type: Number,
        default: 0
    },
    photo: {
        data: Buffer, // original photo
        contentType: String // name... kapil.png
    },
    shipping: {
        required: false,
        type: Boolean
    }

}, {timestamps: true}
);


module.exports=mongoose.model("product", productSchema);