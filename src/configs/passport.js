/**
 * This file configures passport.js strategies for handling user authentiation.
 * These are called by passport.authenticate() in other parts of the project.
 * It ultimatley allows the user to sign in localy or with google, and persist that authentication.
 */

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const database = require("./database");
const passwordUtils = require("./bcrypt.js");



// settings for strategies
const localOptions = {
    usernameField: "email",
    passwordField: "password"
};
const googleOptions = {
    clientID: "762330984825-6du48rjium3fuq8118ketappimpeqpvj.apps.googleusercontent.com" ,
    clientSecret: "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",
    callbackURL: "http://localhost:8080/auth/google"
};



// verify if local user is valid
const authLocal = async (email, password, done) => {

    const user = await database.getUserFromEmail(email);

    if (!user) {
        return done(null, false, { message: "User Not Found" });
    }

    if(user.password === null){
        return done(null, false, { message: "Incorrect Password" });
    }

    const passwordsMatch = await passwordUtils.comparePasswords(password, user.password);

    if (passwordsMatch) {

        return done(null, user);
    }
    return done(null, false, { message: "Incorrect Password" });
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



passport.use(new LocalStrategy(localOptions, authLocal));
passport.use(new GoogleStrategy(googleOptions, authGoogle));
module.exports = passport;
