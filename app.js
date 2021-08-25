const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const expressValidator = require("express-validator");
require('dotenv').config();

//import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productsRoutes = require('./routes/product');
//app 
const app = express();

//db connection
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex:true
}).then(() => console.log('DB Connected'))
  mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`)
});
   

// middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors()); //to handle the request that are
// originating from diff origins as front end has different port number

// routes middleware
app.use("/api",authRoutes); 
app.use("/api",userRoutes); 
app.use("/api",categoryRoutes); 
app.use("/api",productsRoutes); 








const port = process.env.PORT || 8000;

app.listen(port, ()=>{
    console.log(`Server is Running on port ${port}`);
});