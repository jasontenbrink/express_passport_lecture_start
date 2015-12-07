var express = require('express');
var router = express.Router();
var path = require('path');


var passport = require('passport');


router.post('/',
        passport.authenticate('local', {
            successRedirect: '/views/user.html',
            failureRedirect: '/views/failure.html'
        })
);

router.get("/", function(req, res, next){
  //  var file = req.params[0] || 'views/index.html';
    console.log('this is the get path on the login route');
    res.sendFile(path.join(__dirname, "../public/views/login.html"));
});

module.exports = router;
