var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var pg = require('pg');
var Promise = require('bluebird');
var bcrypt = require('bcrypt');

var connectionString = process.env.DATABASE_URL   || 'postgres://localhost:5432/church';
passport.serializeUser(function(user, done){
  console.log('Serializer, what is the value of username', user.username);

    done(null, user.username);
});

passport.deserializeUser(function(id, done){
  console.log('is this getting called inside deserializeUser?');
  console.log('deserialize id is: ', id);
  //find a user and then say done(null, user)
  pg.connect(connectionString, function (err, client) {
    client.query("select username, password from people where username = $1", [id],
  function (err, response) {
    console.log('this is the response in deserializer', response);
    username = response.rows[0].username;
    client.end();
    done(null, username);
  });
});

});

passport.use('local', new localStrategy({
    passReqToCallback: true,
    usernameField: 'username' //might need to be email
    }, function(req, username, password, done) {
      //make DB call to get userspassword. on the post body.
    console.log('right before the DB call, req.body', req.body);

    pg.connect(connectionString, function (err,client) {
      //send pasword down to DB as well and pull out the info, that way we don't pull
      client.query("select password, pin from people where username = 'jasont2'",
      function (err, response) {
        var dbPassword = response.rows[0].password;
        client.end();
        console.log('the password from the DB', dbPassword);
        //console.log('password from login', req.body.password);
          console.log('req.body after sql call', req.body);

            bcrypt.compare(req.body.password, dbPassword, function(err, isMatch){
                if(err) return err;
                //cb(null, isMatch);
              //  console.log('this is the incoming password.  IS it hashed?', );
                console.log('isMatch value from compare', isMatch);

                if (isMatch){
                  //console.log(done);
                  //return done(null, req.body);
                  return done(null, req.body);
                  //close connection
                }
                else{
                  return done(null, false, {message:'failed'});
                }
              //  console.log('does done 2 get seen?');
                //return done(null, req.body);
            });
          //  client.end();
      });

    });
//done(null, req.body);

}));

module.exports = passport;

// function(candidatePassword, cb){
//     bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
//         if(err) return cb(err);
//         cb(null, isMatch);
//     });
        // User.findOne({username: username}, function (err, user) {
        //     if (err) throw err;
        //     if (!user) return done(null, false, {message: 'Incorrect username and password'});
        //     user.comparePassword(password, function (err, isMatch) {
        //         if (err) throw err;
        //         if (isMatch) {
        //             return done(null, user);
        //         } else {
        //             done(null, false, {message: 'Incorrect username and password'});
        //         }
        //     });
        // });
