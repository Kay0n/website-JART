/**
 * This file contains routes for authentication.
 * This includes the login and register page via GET, as well as POST methods
 * for google auth, registration, login and logout logic
 */

const express = require("express");
// const passport = require("../configs/passport.js");
const database = require("../configs/database.js");
// const passwordUtils = require("../configs/bcrypt.js");
const router = express.Router();



// page serves
router.get("/", (req, res) => {
    res.redirect("/");
});

router.get("/user", (req, res) => {
    res.sendFile("user.html", { root: "src/pages" });
});

router.get("/manager", (req, res) => {
    res.sendFile("manager.html", { root: "src/pages" });
});

// only keeping for testing purposes
// router.get("/addClub", (req, res) => {
//     res.sendFile("addClub.html", { root: "src/pages" });
// });





// === get requests ===
// get clubs
router.get("/getClubs", async (req, res, next) => {
    let sql = `SELECT * FROM clubs ORDER BY number_members;`;

    const result = await database.query(sql, []);
    const rows = result[0];

    res.json(rows);
});

// get club posts
router.get("/getPosts", async (req, res, next) => {
    let sql = `SELECT * FROM club_posts ORDER BY creation_time DESC;`;

    const result = await database.query(sql, []);
    const rows = result[0];

    res.json(rows);
});

// get club events
router.get("/getEvents", async (req, res, next) => {
    let sql = `SELECT * FROM club_events ORDER BY creation_time DESC;`;

    const result = await database.query(sql, []);
    const rows = result[0];

    res.json(rows);
});





// === post requests ===
// add club
router.post("/addClub", async (req, res, next) => {
    const sql = "INSERT INTO clubs (name, description, number_members) VALUES (?, ?, ?);";
    await database.query(sql, [req.body.title, req.body.description, 0]);

    database.addManager(req.body.title, req.user.user_id);

    return res.redirect("/query/user");
});

// add club member, needs to only be present if not a member
router.post("/addMember", async (req, res, next) => {
    // need to make dynamic
    database.addMember("j", req.user.user_id);

    return res.redirect("/query/user");
});

// add club manager
router.post("/addManager", async (req, res, next) => {
    // need to make dynamic
    database.addManager("testing", req.user.user_id);

    return res.redirect("/query/manager");
});

// add post
router.post("/addPost", async (req, res, next) => {
    let is_private = (req.body.private === "on" ? 1 : 0);

    const club_query = "SELECT club_id FROM clubs WHERE name = ?;";
    let get_club_id = await database.query(club_query, ["g"]);
    let clubs_id = get_club_id[0][0].club_id;

    const sql = "INSERT INTO club_posts (title, content, creation_time, is_private, club_id) VALUES (?, ?, NOW(), ?, ?);";
    await database.query(sql,
        [req.body.title, req.body.content, is_private, clubs_id]
    );

    return res.redirect("/query/manager");
});

// add event
router.post("/addEvent", async (req, res, next) => {
    let is_private = (req.body.private === "on" ? 1 : 0);

    const club_query = "SELECT club_id FROM clubs WHERE name = ?;";
    let get_club_id = await database.query(club_query, ["g"]);
    let clubs_id = get_club_id[0][0].club_id;

    const sql = "INSERT INTO club_events (title, description, date, location, creation_time, is_private, club_id) VALUES (?, ?, ?, ?, NOW(), ?, ?);";
    await database.query(sql,
        // eslint-disable-next-line max-len
        [req.body.title, req.body.description, req.body.date, req.body.location, is_private, clubs_id]
    );

    return res.redirect("/query/manager");
});

// rsvp for event
router.post("/rsvp", async (req, res, next) => {
    // need to make dynamic
    const sql = "INSERT INTO event_rsvps (event_id, user_id) VALUES (?, ?);";
    await database.query(sql,
        [1, req.user.user_id]
    );
    console.log("RSVP");

    return res.redirect("/query/user");
});



// delete user from club
router.post("/deleteMember", async (req, res, next) => {
    // will need to get the user_id via first name look up for club manager
    // need to make dynamic
    database.removeMember("j", req.user.user_id);

    return res.redirect("/");
});

// delete club
router.post("/deleteClub", async (req, res, next) => {
    // need to make dynamic
    // check if club manager
    const club_query = "SELECT club_id FROM clubs WHERE name = ?;";
    let get_club_id = await database.query(club_query, ["g"]);
    let clubs_id = get_club_id[0][0].club_id;

    const manager_query = "SELECT is_manager FROM club_memberships WHERE user_id = ? AND club_id = ?;";
    let manager_check = (await database.query(manager_query, [req.user.user_id, clubs_id]))[0][0];

    if(manager_check){
        if(manager_check.is_manager){
            // need to make dynamic
            const sql = "DELETE FROM clubs WHERE name = ?;";
            await database.query(sql, ["g"]);
        } else {
            console.log("Not a manager");
        }
    } else {
        console.log("Not a member");
    }

    return res.redirect("/query/manager");
});

// delete post
router.post("/deletePost", async (req, res, next) => {
    // need to make dynamic
    const club_query = "SELECT club_id FROM clubs WHERE name = ?;";
    let get_club_id = await database.query(club_query, ["g"]);
    let clubs_id = get_club_id[0][0].club_id;

    const manager_query = "SELECT is_manager FROM club_memberships WHERE user_id = ? AND club_id = ?;";
    let manager_check = (await database.query(manager_query, [req.user.user_id, clubs_id]))[0][0];

    if(manager_check){
        if(manager_check.is_manager){
            // need to make dynamic
            const sql = "DELETE FROM club_posts WHERE post_id = ?;";
            await database.query(sql, [6]);
        } else {
            console.log("Not a manager");
        }
    } else {
        console.log("Not a member");
    }

    return res.redirect("/query/manager");
});


// set routes and export
module.exports = router;