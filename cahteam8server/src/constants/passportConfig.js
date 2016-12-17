const passport = require('passport');
const passportLocal = require('passport-local');

const localStrategy = passportLocal.Strategy;

const {db} = require('./database');

passport.serializeUser(function(user, done) {
  console.log("Serizalized User " + user);
  done(null,user);
});

passport.deserializeUser(function(user, done) {
  console.log("Deserialize User " + user);
  done(null,user);
});

function initPassport()
{
  passport.use(new localStrategy({
     usernameField: 'email',passwordField:'password',passReqToCallback: true},
    function(req,email,password,done){
       if(email == "" |password =="")
         return done(null,false);
       else
       {
           const encryptedPassword = new Buffer(password).toString('base64');
           const authenticationQuery = `select * from player where email = $1  AND password = $2`;
           db.any(authenticationQuery,[email,encryptedPassword])
              .then(function(data) {
           if( data.length == 0)
           {
             return done(null,false);
           }
           else
           {
             return done(null,email);
           }
         })
         .catch(function(error) {
          console.log("ERROR:",error);
           return done(error,false);
         });
       }
 }))
}

module.exports = {initPassport};
