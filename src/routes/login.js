const express = require("express");
const router = express.Router();


// login page route
router.get("/login", (req, res) => {
    res.sendFile("login.js");
});


// set routes and export
module.exports = router;

