//load Express Module
var express = require('express');
var server = express();
var fs = require('fs');
var flash=require('connect-flash');
server.use(flash());

var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/lab");
fs.readdirSync(__dirname+"/models").forEach(function (file) {
    require("./models/"+file);
});

var session = require("express-session");
var sessionMiddleware = session({
    secret:"#@$@#%$^&"
});


server.use(sessionMiddleware);

server.use(function(request,response,next){
    var loggedIn=request.session.loggedIn;
    var username=request.session.username;
    var img=request.session.img;
    response.locals={loggedIn:loggedIn,username:username, img:img};
    next();
});

server.use(express.static('public'));
//Entity "ProductS"
var productsRouter = require("./controllers/products");
server.use("/products",productsRouter);
//Entity "USERS"
var usersRouter = require("./controllers/users");
server.use("/users",usersRouter);
//Entity "Auth"
var authRouter = require("./controllers/auth");
server.use("/auth",authRouter);
//Entity "CATEGORY"
//Entity "COMMENTS"

server.set("view engine","ejs");
server.set("views","./views");

server.get("/",function(request, response){
    response.redirect("/products");
});



server.listen(8090);