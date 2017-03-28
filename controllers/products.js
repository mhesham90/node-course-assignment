var express = require('express');
var router = express.Router();
var bodyParser=require('body-parser');
var postMiddleware=bodyParser.urlencoded({extended:false});
var mongoose = require("mongoose");
var fs = require("fs");

var multer=require("multer");
var uploadFileMiddleware=multer({dest:__dirname+"/../public",
    fileFilter:function(request,file,cb){
        if(file.mimetype=="image/jpeg" || file.mimetype=="image/jpg" || file.mimetype=="image/png"){
            request.fileStatus="file uploaded";
            cb(null,true);
        }else{
            request.fileStatus="file not uploaded";
            cb(null,false);
        }

    }});



var productData = fs.readFileSync(__dirname+"/products.db").toString();
var products = JSON.parse(productData);

router.use(function (request,response,next) {
    if(request.session.loggedIn){
        next();
    }else{
        response.redirect("/auth/login");
    }
});

router.get("/",function(request, response){
    response.locals.myTitle = "Products";
    mongoose.model("products").find({ user: request.session.username }, {}, function(err, products) {
        response.locals.myProducts = products;
        response.render("products/list",{ message: request.flash("message"),successMessage: request.flash("successMessage") });
    });
});


router.get("/new",function(request, response){
    response.locals.myTitle = "Add New Product";
    response.render("products/new");
});
router.post("/new",uploadFileMiddleware.single("avatar"), function(request, response){
    var productModel = mongoose.model("products");
    var product = new productModel({ name: request.body.name, description: request.body.description, price: request.body.price, image: request.file.filename, user: request.session.username });
    product.save(function(err) {
        if (err) {
            request.flash("message","Error occurred while adding product");
            response.redirect("/products");
        }
    });
    request.flash("successMessage","Product added successfully");
    response.redirect("/products");
});


router.get("/edit/:id",function(request, response){
    response.locals.myTitle = "Edit Product";
    mongoose.model("products").findOne({ _id: request.params.id }, {}, function(err, product) {
        if (err) {
            request.flash("message","Error editing product");
            response.redirect("/products");
        } else if (product){
            response.locals.product = product;
            response.render("products/edit");
        } else {
            request.flash("message","Product not found");
            response.redirect("/products");
        }
    })
});
router.post("/edit", uploadFileMiddleware.single("avatar"), function(request, response){
    mongoose.model("products").update({ _id: request.body.id }, { $set: { name: request.body.name, description: request.body.description, price: request.body.price, image: request.file.filename } }, function(err, product) {
        if (err) {
            request.flash("message","Error editing product");
            response.redirect("/products");
        }
    });
    request.flash("successMessage","Product edited successfully");
    response.redirect("/products");
});


router.get("/delete/:id",function(request, response){
    mongoose.model("products").remove({ _id: request.params.id }, function(err, product) {
        if (err) {
            request.flash("message","Error deleting product");
            response.redirect("/products");
        }
    });
    request.flash("successMessage","Product deleted successfully");
    response.redirect("/products");
});

router.get("/search",function(request, response) {
    mongoose.model("products").find({ name: request.query.name,user:request.session.username }, function(err, products) {
        if (err) {
            request.flash("message","Error searching product");
            response.redirect("/products");
        }
        response.locals.myTitle = "Search";
        response.locals.myProducts = products;
        request.flash("successMessage",products.length+" product(s) found");
        response.render("products/search", { message: request.flash("message"),successMessage: request.flash("successMessage") });
    });
});



module.exports = router;