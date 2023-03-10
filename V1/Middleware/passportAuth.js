const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const jwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const jwt = require("jsonwebtoken");
const User = require("../Model/userSchema");

passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const isUser = await User.findOne({ email });
        if (isUser) {
          return done(null, { status: false, message: "User Already Exists." });
        }
        const userData = await User.create({ email, password });
        return done(null, {
          status: true,
          email: userData.email,
          message: "Registration Successful.",
        });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      const isUser = await User.findOne({ email });
      if (!isUser) {
        return done(null, { status: false, message: "User Does Not Exists." });
      }
      const isValid = await isUser.isValidPassword(password);
      if (isValid == false) {
        return done(null, { status: false, message: "Incorrect Password." });
      }
      const token = await jwt.sign(
        { email: isUser.email },
        process.env.JWT_SECRET
      );
      return done(null, {
        status: true,
        email: isUser.email,
        token: token,
        message: "Logged In Successful.",
      });
    }
  )
);

passport.use(
  "jwt",
  new jwtStrategy(
    {
      secretOrKey: "mihirPractical",
      jwtFromRequest: ExtractJwt.fromHeader("authorization"),
    },
    (decode, done) => {
      try {
        done(null, { status: true, email: decode.email });
      } catch (error) {
        done(error);
      }
    }
  )
);
