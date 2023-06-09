const express = require("express");
const validator = require("../configs/validator");
const passport = require("../configs/passport.js");
const schemas = require("../configs/schemas.js");
const router = express.Router();


// page serves
router.get("/login", (req, res) => {
    res.sendFile("login.html", { root: "src/pages" });
});


// login user
// return: JSON = errorMessages: [{"<field_name>": "<error_message"}...]
router.post(
    "/login",
    validator.checkSchema({
        email: schemas.email,
        password: schemas.passwordNoLength
    }),
    (req, res, next) => {

        if(validator.returnSchemaErrors(req,res)){ return; }

        passport.authenticate("local", { failureMessage: true }, (err, user, info) => {
            if (err || !user) {
                return res.status(401).json({ errorMessages: info.errorMessages });
            }
            return req.logIn(user,() => res.status(200).end());
        })(req, res, next);

    }
);


// google login and register
const googleAuthCB = passport.authenticate("google", {
    scope: ["profile", "email"],
    successRedirect: "/",
    failureRedirect: "/"
});
router.get("/auth/google",googleAuthCB);
router.post("/auth/google",googleAuthCB);


// logout
router.get("/logout", (req, res, next) => {
    req.logout((err) => {});
    res.clearCookie("wdcproject");
    res.redirect("/");
});


module.exports = router;
