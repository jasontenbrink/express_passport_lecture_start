var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var Users = require('../models/user');
var pg  = require('pg ');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;


var connectionString = process.env.DATABASE_URL   || 'postgres://localhost:5432/church';

router.get('/', function (req, res, next){
    res.sendFile(path.resolve(__dirname, '../public/views/register.html'));
});

router.post('/', function(req,res,next){

  var user = req.body;

//  if(!user.isModified('password')) return next;

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
      if(err) return next(err);

      bcrypt.hash(user.password, salt, function(err, hash){
          if(err) return next(err);

          user.password = hash;
          next();
      });
  });


  pg.connect(connectionString, function (err, client, done) {
    if (err) console.log(err);
    client.query('insert into people (email, password) VALUES ($1, $2)',
        [req.body.username, req.body.password],
        function (err, res) {
          if (err) console.log(err);
          else  res.redirect('/');
        });
  });


  // (err, client, done) {
  //   var query = client.query('SELECT * FROM people WHERE' +
  //                             ' first_name ILIKE $1 AND last_name ILIKE $2' +
  //                             ' AND email ILIKE $3',
  //    [firstNameParam, lastNameParam, emailParam]);
    // Users.create(req.body, function(err,post){
    //     if(err){
    //         next(err);
    //     } else {
    //         res.redirect('/');
    //     }
    // }) ;
});

module.exports = router;
