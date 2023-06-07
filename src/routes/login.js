const express = require("express");
const validator = require("express-validator");
const passport = require("../configs/passport.js");
const schemas = require("../configs/validationSchemas.js");
const router = express.Router();



// page serves
router.get("/", (req, res) => {
    res.redirect("/login");
});
router.get("/login", (req, res) => {
    res.sendFile("login.html", { root: "src/pages" });
});



// login user
// return: JSON = errorMessages: [{"<field_name>": "<error_message"}...]
router.post("/login", validator.checkSchema(schemas.loginSchema), (req, res, next) => {

    const errors = validator.validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(400).json({ errorMessages: errorMessages });
    }

    passport.authenticate("local", { failureMessage: true }, (err, user, info) => {
        if (err || !user) {
            return res.status(401).json({ errorMessages: info.errorMessages });
        }
        return req.logIn(user,() => res.status(200).end());
    })(req, res, next);

    return 0;
});



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
