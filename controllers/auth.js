var express = require('express');
var router = express.Router();
var bodyParser=require('body-parser');
var postMiddleware=bodyParser.urlencoded({extended:false});
var bcrypt=require("bcrypt");
var mongoose=require("mongoose");

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

router.get("/",function(request, response){
    response.render("users/list");
});
router.get("/login",function(request, response){
    response.locals.myTitle = "Login";
    response.render("users/login", { message: request.flash("message"),successMessage: request.flash("successMessage") });
});
router.post("/login", postMiddleware, function(request, response){
    mongoose.model("users").findOne({ name: request.body.username }, { _id: false, password: true, name: true,avatar: true }, function(err, user) {

        if (!err) {
            if (user) {
                user.comparePassword(request.body.password,function (err, isMatch) {
                    if(!err) {
                        if (isMatch) {
                            request.session.loggedIn = true;
                            request.session.username = request.body.username;
                            request.session.img = user.avatar;
                            response.redirect("/");
                        } else {
                            request.flash("message", "Invalid username or password");
                            response.redirect("/auth/login")
                        }
                    }
                });
            }
        }
    });
});

router.get("/register",function(request, response){
    response.locals.myTitle = "Register";
    response.render("users/register",{ message: request.flash("message") });
});

router.post("/register",uploadFileMiddleware.single("avatar"),function(request, response){
    var UserModel=mongoose.model("users");
    mongoose.model("users").find({name:request.body.username},{},function (err,user) {
        if(!err){
            if(user == ""){
                var salt=bcrypt.genSaltSync();
                var hashedPassword=bcrypt.hashSync(request.body.password,salt)
                var user=new UserModel({name:request.body.username,password:hashedPassword,avatar:request.file.filename});
                user.save(function(err){
                    if(!err){
                        request.flash("successMessage","Registered successfully");
                        response.redirect("/auth/login");
                    }else{
                        response.send("Error");
                    }
                })
            }else{
                request.flash("message","Username exists");
                response.redirect("/auth/register");
            }

        }
    });
});

router.get("/logout",function(request,response){
    request.session.destroy();
    response.redirect("/auth/login")
});




module.exports = router;