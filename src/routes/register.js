const database = require("../configs/database.js");
const passwordUtils = require("../configs/bcrypt.js");
const validator = require("../configs/validator.js");
const schemas = require("../configs/schemas.js");
const express = require("express");
const router = express.Router();


// page serve
router.get("/register", (req, res) => {
    res.sendFile("register.html", { root: "src/pages" });
});


// create and autheticate user
// return: JSON = errorMessages: [{"<field_name>": "<error_message"}...]
router.post("/register", validator.checkSchema(schemas.registerSchema), async (req, res, next) => {

    const errorMessages = validator.getSchemaErrors(req);
    if (errorMessages.length) {
        return res.status(400).json({ errorMessages });
    }

    const user = await database.getUserFromEmail(req.body.email);

    if(user){
        return res.status(400).json({ errorMessages: [{ email: "This email is already in use" }] });
    }

    const hashedPassword = await passwordUtils.hashPassword(req.body.password);

    const newUser = await database.createUser(
        req.body.email,
        hashedPassword,
        req.body.given_name,
        req.body.family_name
    );

    return req.logIn(newUser,() => res.status(201).end());

});


module.exports = router;
