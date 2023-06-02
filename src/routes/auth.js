/**
 * This file contains routes for authentication.
 * This includes the login and register page via GET, as well as POST methods
 * for google auth, registration, login and logout logic
 */

const express = require("express");
const validator = require("express-validator");
const passport = require("../configs/passport.js");
const database = require("../configs/database.js");
const passwordUtils = require("../configs/bcrypt.js");
const schemas = require("../configs/validationSchemas.js");
const router = express.Router();



// page serves
router.get("/", (req, res) => {
    res.redirect("/auth/login");
});
router.get("/login", (req, res) => {
    res.sendFile("login.html", { root: "src/pages" });
});
router.get("/register", (req, res) => {
    res.sendFile("register.html", { root: "src/pages" });
});



// logout
router.get("/logout", (req, res, next) => {
    req.logout((err) => {});
    res.clearCookie("wdcproject");
    res.redirect('/');
});



router.post("/login", validator.checkSchema(schemas.login), function(req, res, next) {

    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(400).json({ message: errorMessages });
    }

    passport.authenticate("local", { failureMessage: true }, (err, user, info) => {

        // auth failed
        if (err || !user) {
            return res.status(401).json({ message: info.message });
        }

        req.logIn(user, function(error) {
            return res.redirect("/");
        });
        return info;
    })(req, res, next);
});



// create and autheticate user
router.post("/register", async (req, res, next) => {

    const user = await database.getUserFromEmail(req.body.email);

    if(user){
        res.send("User already exists!");
        return;
    }

    const hashedPassword = await passwordUtils.hashPassword(req.body.password);

    const newUser = await database.createUser(
        req.body.email,
        hashedPassword,
        req.body.given_name,
        req.body.family_name
    );

    req.login(newUser, function(err) {
        if (err) { return next(err); }
        return res.redirect("/");
    });

});



// google register and auth
const googleAuthCB = passport.authenticate('google', {
    scope: ['profile', 'email'],
    successRedirect: '/',
    failureRedirect: '/'
});
router.get("/google",googleAuthCB);
router.post("/google",googleAuthCB);



// set routes and export
module.exports = router;

