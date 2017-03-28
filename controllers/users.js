var express = require('express');
var router = express.Router();

router.get("/",function(request, response){
    response.render("users/list");
});
router.get("/new",function(request, response){
    response.send('new user get');
});
router.post("/new",function(request, response){
    response.send('new user post');
});
router.get("/edit",function(request, response){
    response.send('edit user get');
});
router.post("/edit",function(request, response){
    response.send('edit user post');
});




module.exports = router;