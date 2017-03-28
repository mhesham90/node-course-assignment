var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt=require("bcrypt");

var users = new Schema({
    name: String,
    password: String,
    address: String,
    age: Number,
    avatar:String
});
users.methods.comparePassword = function (passwd, cb) {
    bcrypt.compare(passwd,this.password,function (err,isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    });
};
mongoose.model("users",users);

// var UserModel = mongoose.model("users");
// var user = new UserModel({name:"ahmed"});
// user.save(function (err) {
//     if(!err){
//         console.log(user);
//     }
// });

// mongoose.model("users").find({},{},function (err,users) {
//     if(!err){
//         console.log(users);
//     }
// });
// mongoose.model("users").update({},function (err,users) {
//     if(!err){
//
//     }
// });
