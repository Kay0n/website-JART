const express = require("express");
const router = express.Router();


// login page route
router.get("/register", (req, res) => {
    res.sendFile("register.js");
});


// set routes and export
module.exports = router;

