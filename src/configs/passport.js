const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const database = require("./database"); // using fake database to test user login and logout



// settings for strategies
const localOptions = {
    usernameField: "email",
    passwordField: "password"
};
const googleOptions = {
    clientID: "762330984825-6du48rjium3fuq8118ketappimpeqpvj.apps.googleusercontent.com" ,
    clientSecret: "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",
    callbackURL: "http://localhost:8080/auth/google",
    passReqToCallback: true
};


// called to verify if user is valid
const authUserLocal = (email, password, done) => {

    console.log("authUserLocal called");

    const user = database.getUser(email, "email");

    // user not found
    if (!user) {
        return done(null, false, { message: "User Not Found" });
    }

    // user is google account
    if(user.alt_signin_id){
        return done(null, false, { message: "User is google" });
    }

    // password incorrect
    if (user.password !== password) {
        return done(null, false, { message: "Incorrect Password" });
    }

    // authenticate user
    done(null, user);

};



const authUserGoogle = (request, accessToken, refreshToken, profile, done) => {

    const user = database.getUser(profile.email, "email");

    // new user, create account
    if (!user) {
        return done(null, false, { message: "User Not Found" });
    }


    // authenticate user
    done(null, user);
};


// serialize user to session
passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((userId, done) => {
    let user = database.getUser(userId, "id");
    if(user){
        done(null, user);
        return;
    }
    done(null, false);
});


// export
passport.use(new LocalStrategy(localOptions, authUserLocal));
passport.use(new GoogleStrategy(googleOptions, authUserGoogle));
module.exports = passport;
