const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true, //to remove spaces 
        required: true,
        maxlength: 52
    },
    
}, {timestamps: true}
);


module.exports=mongoose.model("Category", categorySchema);