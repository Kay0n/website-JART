/**
 * This file configures passport.js strategies for handling user authentiation.
 * These are called by passport.authenticate() in other parts of the project.
 * It ultimatley allows the user to sign in localy or with google, and persist that authentication.
 */

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const database = require("./database.js");
require('dotenv').config();


// settings for strategies
const localOptions = {
    usernameField: "email",
    passwordField: "password"
};
const googleOptions = {
    clientID: process.env.GOOGLE_CLIENT_ID ,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/google"
};


// verify if local user is valid
const authLocal = async (email, password, done) => {

    const user = await database.getUserFromEmail(email);

    if (!user) {
        return done(null, false, { errorMessages: [{ email: "User Not Found" }] });
    }

    if(user.password === null){
        return done(null, false, { errorMessages: [{ password: "Invalid password" }] });
    }

    const passwordsMatch = await passwordUtils.comparePasswords(password, user.password);

    if (passwordsMatch) {
        return done(null, user);
    }

    return done(null, false, { errorMessages: [{ password: "Invalid password" }] });
};


// verify if google user is valid, will create user if non-existant
const authGoogle = async (request, accessToken, refreshToken, profile, done) => {

    const user = await database.getUserFromEmail(profile.email);

    if(user){
        return done(null, user);
    }

    const newUser = await database.createUser(
        profile.email,
        null,
        profile.given_name,
        profile.family_name
    );

    return done(null, newUser);
};


// used by passport.js to serealize the user between session and req object
passport.serializeUser((user, done) => {
    done(null, user.user_id);
});
passport.deserializeUser(async (user_id, done) => {
    const user = await database.getUserFromID(user_id)
        .catch((err) => { done(err, null); });
    if(!user){
        return done("Error: could not find user in database when deserializing", null);
    }
    return done(null, user);
});


const notAuthSend401 = (req, res, next) => {
    if(!req.isAuthenticated()){
        return res.sendStatus(401);
    }
    return next();
};


const notAuthRedirectIndex = (req, res, next) => {
    if(!req.isAuthenticated()){
        return res.redirect("/");
    }
    return next();
};


passport.use(new LocalStrategy(localOptions, authLocal));
passport.use(new GoogleStrategy(googleOptions, authGoogle));
module.exports = passport;
module.exports.notAuthSend401 = notAuthSend401;
module.exports.notAuthRedirectIndex = notAuthRedirectIndex;
