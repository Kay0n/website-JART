/**
 * This file contains routes for authentication.
 * This includes the login and register page via GET, as well as POST methods
 * for google auth, registration, login and logout logic
 */

const express = require("express");
const passport = require("../configs/passport.js");
const database = require("../configs/database.js");
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



// login auth
router.post(
    "/login",
    passport.authenticate("local", {
        failureMessage: true,
        failureRedirect: "/",
        successRedirect: "/"
    })
);



// create and autheticate user
router.post("/register", async (req, res, next) => {

    const user = await database.getUserFromEmail(req.body.email);

    if(user){
        res.send("User already exists!");
        return;
    }

    const newUser = await database.createUser(
        req.body.email,
        req.body.password,
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

