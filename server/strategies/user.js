var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var pg = require('pg');
var Promise = require('bluebird');
var bcrypt = require('bcrypt');

var connectionString = process.env.DATABASE_URL   || 'postgres://localhost:5432/church';
passport.serializeUser(function(user, done){
  console.log('Serialize, what is the value of username', user.username);

    done(null, user.username);
});

passport.deserializeUser(function(id, done){
  console.log('deserialize, is this getting called inside deserializeUser?');
  //find a user and then say done(null, user)
  pg.connect(connectionString, function (err, client, done) {
    client.query("select username, password from people where pin = $1", [id],
    function (err, response) {
      user = response;
      done(null, user);
      });
    });

});



passport.use('local', new localStrategy({
    passReqToCallback: true,
    usernameField: 'username' //might need to be email
    }, function(req, username, password, done) {
      //make DB call to get userspassword. on the post body.
    console.log('this is the req body from the strat, newb', req.body);

    pg.connect(connectionString, function (err,client, done) {
      client.query("select password, pin from people where username = 'jasont2'",
      function (err, response) {
        var dbPassword = response.rows[0].password;
        console.log('the password from the DB', dbPassword);
        console.log('password from login', req.body.password);

            bcrypt.compare(req.body.password, dbPassword, function(err, isMatch){
                if(err) return cb(err);
                //cb(null, isMatch);
              //  console.log('this is the incoming password.  IS it hashed?', );
                console.log('isMatch value from compare', isMatch);
                if (isMatch){
                  //console.log('just before done');
                  //return done(null, req.body);
                  return done(null, req.body);
                  //close connection
                }
              //  console.log('does done 2 get seen?');
                //return done(null, req.body);
                return done (null, req.body);
            });
          //  client.end();
          done(null, true);

      });

    });
//done(null, req.body);

}));

module.exports = passport;
