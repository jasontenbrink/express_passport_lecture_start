var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var pg = require('pg');
var User = require('../models/user');
var Promise = require('bluebird');
var bcrypt = require('bcrypt');


var connectionString = process.env.DATABASE_URL   || 'postgres://localhost:5432/church';

//what does this do?  Create the cookie?  Or maybe the session?
//It runs after the local strategy
passport.serializeUser(function(user, done){
  // user parameter comes from the successful "done" in the bcrypt.compare method
  // in the strategy
  console.log('Serializer, what is the value of username', user.username);
  console.log('Serializer, what is the value of user', user);

    done(null, user.username);
});

// this puts things onto req.user.  Will put things on the req during
// preprocessing/middleware
passport.deserializeUser(function(id, done){
  //console.log('What is req.user in the deserializer?');
  console.log('deserialize id is: ', id);
  //console.log('session is', passport.session);
  pg.connect(connectionString, function (err, client) {
    client.query("select username, password from people where email = $1", [id],
  function (err, response) {
  //  console.log('this is the response in deserializer', response.rows[0].username);
    client.end();
    username = response.rows[0].email;

    //at this point we put whatever we want into the req.user property (second argument
    // of done).
    //req.user will automatically get added to all requests coming from this client
    //(determined by the cookie the client gives us).  It gets added on by Passport
    //during the middleware part of processing the request.
    done(null, 'hi');
  });
});

});

passport.use('local', new localStrategy({
    passReqToCallback: true,

    //this needs to be whatever property the client is
    //sending the username in as under req.body
    usernameField: 'username'

    }, function(req, username, password, done) {
      //make DB call to get userspassword. on the post body.
    console.log('right before the DB call, req.body', req.body);

    //don't add in 'done' as the third parameter, it will eat the 'done' that
    //the callback strategy needs.
    pg.connect(connectionString, function (err,client) {

      //get hashed password to compare
      client.query("select password, pin from people where email = 'jasont2'",
      function (err, response) {
        var dbPassword = response.rows[0].password;
        client.end();
        console.log('the password from the DB', dbPassword);

          //compare passwords, bcrypt.compare hashes the first argument using
          //the salt factor that was already set up (set up in register.js for now)
            bcrypt.compare(req.body.password, dbPassword, function(err, isMatch){
                if(err) return err;
                console.log('isMatch value from compare', isMatch);

                //this var gets sent to SerializeUser and is passed in as the
                //user parameter. I think SerializeUser is what actually makes
                //the session.
                var objectSentToSerializer = {
                  username: req.body.username,
                  randomFunMessage: 'chickenButt'
                };

                if (isMatch){
                  return done(null, objectSentToSerializer);
                }
                else{
                  return done(null, false, {message:'failed'});
                }
            });
      });
    });
}));

module.exports = passport;
