const Category = require("../models/category");
const {errorHandler} = require('../helpers/dbErrorHandler');


exports.categoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if(err || !category) {
            return res.status(400).json({
                error: "Category does not exist "
            });
        }
        req.category = category;
        next();
    });
} 

// CREATE
exports.create = (req, res) => {
    // create a new category
    const category = new Category(req.body);
    // console.log(req.body);
    category.save((err, data) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({data});
    });
};

// READ
exports.read = (req, res) => {
    return res.json(req.category);
}

//UPDATE
exports.update = (req, res) => {
    const category = req.category;
    category.name = req.body.name;
    category.save((err, data) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(data);
    }) 
}


// DELETE
exports.remove = (req, res) => {
    let category = req.category;
    category.remove((err, deletedProduct) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        return res.json({
            message: "Category deleted Successfully"
        });
    });
}

//LIST ALL
exports.list = (req, res) => {
    Category.find().exec((err, data) => {
        if(err) {
            return res.status(400).json({
                error: errorHandler(err)
            })
        }
        res.json(data);
    });
}