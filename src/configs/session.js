/**
 * This file exports session middleware for managing user sessions.
 * It is used by passport.js to persist the user across sessions.
 */

const session = require("express-session");
const dayInMilliseconds = 1000 * 60 * 60 * 24;


const sessionMiddleware = session({
    name: "wdcproject", // name of session
    secret: "secretKey5", // key used to authenticate session cookie
    saveUninitialized: false, // save if not yet initialized
    cookie: { // settings for cookie created on client
        maxAge: dayInMilliseconds,
        sameSite: "lax"
    },
    resave: false // save even if never modified
});


module.exports = sessionMiddleware;
