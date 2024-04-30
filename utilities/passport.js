const passport = require('passport');
const passportJWT = require('passport-jwt');
const User = require('../Modal/Student'); // Replace with your user model import

const JwtStrategy = passportJWT.Strategy;
const ExtractJwt = passportJWT.ExtractJwt;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET, 
};

passport.use(new JwtStrategy(jwtOptions, (jwtPayload, done) => {
  User.findById(jwtPayload.id, (err, user) => {
    if (err) {
      return done(err, false);
    }
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
}));

module.exports = passport