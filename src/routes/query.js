/**
 * This file contains routes for authentication.
 * This includes the login and register page via GET, as well as POST methods
 * for google auth, registration, login and logout logic
 */

const express = require("express");
const passport = require("../configs/passport.js");
const database = require("../configs/database.js");
const passwordUtils = require("../configs/bcrypt.js");
const router = express.Router();



// page serves
router.get("/", (req, res) => {
    res.sendFile("test.html", { root: "src/pages" });
});

// only keeping for testing purposes
// router.get("/addClub", (req, res) => {
//     res.sendFile("addClub.html", { root: "src/pages" });
// });


// add club manager
router.post("/addManager", async (req, res, next) => {
    // make dynamic
    database.addManager("testing", req.user.user_id);

    return res.redirect("/query");
});

// add club member, needs tp only be present if not a member
router.post("/addMember", async (req, res, next) => {
    // database.addMember(req.body.club_name, req.user.user_id);
    database.addMember(req.body.club_name, req.body.user_id);

    return res.redirect("/query");
});

// add club
router.post("/addClub", async (req, res, next) => {
    const sql = "INSERT INTO clubs (name, description, number_members) VALUES (?, ?, ?);";
    await database.query(sql, [req.body.title, req.body.description, 0]);

    database.addManager(req.body.title, req.user.user_id);

    return res.redirect("/query");
});


// set routes and export
module.exports = router;





// /**
//  * This file contains routes for authentication.
//  * This includes the login and register page via GET, as well as POST methods
//  * for google auth, registration, login and logout logic
//  */

// const express = require("express");
// const passport = require("../configs/passport.js");
// const database = require("../configs/database.js");
// const passwordUtils = require("../configs/bcrypt.js");
// const router = express.Router();



// // page serves
// router.get("/", (req, res) => {
//     const queryMenu = `
//         <h2>Query Menu</h2>
//         <a href="query/addClub">Add club</a><br>
//         <button type="button" onclick="test()">Add manager</button>
//         <script>
//             function test(){
//                 console.log("test complete");
//                 fetch("/query/addManager", {
//                     method: 'POST'
//                 });
//             }
//         </script>
//     `;

//     res.send(queryMenu);
// });

// router.get("/addClub", (req, res) => {
//     res.sendFile("addClub.html", { root: "src/pages" });
// });


// // add club manager
// router.post("/addManager", async (req, res, next) => {
//     database.addManager("testing", req.user.user_id);

//     return res.redirect("/query");
// });

// // add club
// router.post("/addClub", async (req, res, next) => {
//     const sql = "INSERT INTO clubs (name, description, number_members) VALUES (?, ?, ?);";
//     await database.query(sql, [req.body.title, req.body.description, 0]);

//     database.addManager(req.body.title, req.user.user_id);

//     return res.redirect("/query");
// });


// // set routes and export
// module.exports = router;

