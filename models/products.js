var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var products = new Schema({
    name: String,
    description: String,
    price: String,
    user: String,
    image: String
});

mongoose.model("products", products);