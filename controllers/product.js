const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { errorHandler } = require("../helpers/dbErrorHandler");
// const product = require("../models/product");

// product by Id middleware
//similar to userById! which will be used as middleware to
// find the product and later on update or delete it!
exports.productById = (req, res, next, id) => {
  Product.findById(id).exec((err, product) => {
    if (err || !product) {
      return res.status(400).json({
        error: "product not found",
      });
    }
    // console.log(product);
    req.product = product;
    next();
  });
};

// READ
exports.read = (req, res) => {
  // remove photo as performance reduce (sparate method to send it)
  req.product.photo = undefined;
  return res.json(req.product);
};

// create
exports.create = (req, res) => {
  // since we have images in the product we cant simply use4
  // req.body.. we have to use something known as form data
  // to handle the form data and the files that comes with it
  // are mamaged by formitable.

  //and also you can use monitor!!

  let form = new formidable.IncomingForm(); //from formidable (method)
  form.keepExtensions = true; //keep .jpg .jpeg
  form.parse(req, (err, fields, files) => {
    // fields: name desc price
    // files: images etc
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }
    //check for all fields!
    const { name, description, price, category, quantity, shipping } = fields;

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({
        error: "All fields are required!",
      });
    }

    let product = new Product(fields);

    // if .photo is send from the client side from the frontend
    if (files.photo) {
      // 1mb = 1000000
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1MB in size!",
        });
      }

      // create product and add the photo!
      // buffer data from the photo! read in sync from the file system!
      product.photo.data = fs.readFileSync(files.photo.path);
      // photo name
      product.photo.contentType = files.photo.type;
    }

    product.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      console.log("saved!!!!!");
      res.json(result);
    });
  });
};

// remove
exports.remove = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "product deleted Successfully!!",
    });
  });
};

exports.update = (req, res) => {
  let form = new formidable.IncomingForm(); //from formidable (method)
  form.keepExtensions = true; //keep .jpg .jpeg
  form.parse(req, (err, fields, files) => {
    // fields: name desc price
    // files: images etc
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }
    //check for all fields!
    const { name, description, price, category, quantity, shipping } = fields;

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({
        error: "All fields are required!",
      });
    }

    // to update the existing product using extend present in lodash
    let product = req.product;
    // fields is updated part!! :)
    product = _.extend(product, fields);

    // if .photo is send from the client side from the frontend
    if (files.photo) {
      // 1mb = 1000000
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1MB in size!",
        });
      }

      // create product and add the photo!
      // buffer data from the photo! read in sync from the file system!
      product.photo.data = fs.readFileSync(files.photo.path);
      // photo name
      product.photo.contentType = files.photo.type;
    }

    product.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      console.log("saved!!!!!");
      res.json(result);
    });
  });
};

// Sell or arival!
// to show certain product which sold more than
// other product
// we might need to show it to the front end client!

// Most Popular products
// or new arrivals

/* 
from front end client
Sell / arrival
by sell = /products?sortBy=sold&order=desc&limit=4
by arrival = /products?sortBy=createdAt&order=desc&limit=4
if no params are sent then sent all
*/

exports.list = (req, res) => {
  // to get the query user entered from the req var.
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  // -photo deselect photo as it will be slow,
  // we will make another req, for photo
  // populate the category, created at updated at
  // console.log(order + " " + sortBy + " " + limit);
  Product.find()
    .select("-photo")
    .populate("Category")
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          error: "Products not found..",
        });
      }
      res.send(products);
    });
};

// show the related products!!
/* 
IT will find the product based on req product category
other product that has the same category will be returned
*/
exports.listRelated = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;

  //ne not including itself and category is curr prod category
  Product.find({ _id: { $ne: req.product }, category: req.product.category })
    .limit(limit)
    .populate("Category", "_id name") // we only want id and name!
    .select("-photo")
    .exec((err, prods) => {
      if (err) {
        return res.status(400).json({
          error: "Products not found",
        });
      }
      res.json(prods);
    });
};

// how many categories are used in product !
exports.listCategories = (req, res) => {
  // {} -> you can pass query on those categories..
  Product.distinct("category", {}, (err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "categories not found",
      });
    }
    res.json(categories);
  });
};

/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */
// shop (react front end ! )
exports.listBySearch = (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip); // load more button! at last
  let findArgs = {}; // this will contain category id and product

  // console.log(order, sortBy, limit, skip, req.body.filters);
  // console.log("findArgs", findArgs);

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        // gte -  greater than price [0-10]
        // lte - less than
        findArgs[key] = {
          $gte: req.body.filters[key][0], // greater $gte
          $lte: req.body.filters[key][1], // less than $lte
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  Product.find(findArgs)
    .select("-photo")
    .populate("Category")
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Products not found",
        });
      }
      res.json({
        size: data.length, // how many products are there.
        data,
      });
    });
};

//middleware to send photot
exports.photo = (req, res) => {
  if (req.product.photo.data) {
    // not json res.
    // so set the content type: .png etc etc
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data); // photo sent !
  }
  next();
};
