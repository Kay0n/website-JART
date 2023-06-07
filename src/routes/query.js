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





// === Multiple person routes (Manager, user and potentially non-user) ===
// get all posts from all clubs that aren't private
router.get("/getAllPosts", async (req, res, next) => {
    let sql = `SELECT * FROM club_posts WHERE is_private = 0 ORDER BY creation_time DESC;`;

    const result = await database.query(sql, []);
    const rows = result[0];

    res.json(rows);
});

// get all events from all clubs that aren't private
router.get("/getAllEvents", async (req, res, next) => {
    let sql = `SELECT * FROM club_events WHERE is_private = 0 ORDER BY creation_time DESC;`;

    const result = await database.query(sql, []);
    const rows = result[0];

    res.json(rows);
});



// === Non-user routes ===
// get all non-private posts for a club
router.get("/getPubPosts", async (req, res, next) => {
    let sql = `SELECT * FROM club_posts WHERE is_private = 0 AND club_id = ? ORDER BY creation_time DESC;`;

    // need to make dynamic
    const result = await database.query(sql, [1]);
    const rows = result[0];

    res.json(rows);
});

// get all non-private events for a club
router.get("/getPubEvents", async (req, res, next) => {
    let sql = `SELECT * FROM club_events WHERE is_private = 0 AND club_id = ? ORDER BY creation_time DESC;`;

    // need to make dynamic
    const result = await database.query(sql, [1]);
    const rows = result[0];

    res.json(rows);
});



// === User and non-user routes ===
// get clubs
router.get("/getClubs", async (req, res, next) => {
    let sql = `SELECT * FROM clubs ORDER BY number_members;`;

    const result = await database.query(sql, []);
    const rows = result[0];

    res.json(rows);
    res.sendStatus(200);
});



// === User routes ===
// get users subscribed clubs posts
router.get("/getSubPosts", async (req, res, next) => {
    let sql = `SELECT * FROM club_posts INNER JOIN club_memberships ON club_posts.club_id = club_memberships.club_id WHERE user_id = ? ORDER BY creation_time DESC;`;

    // need to make dynamic
    const result = await database.query(sql, [2]);
    const rows = result[0];

    res.json(rows);
});

// get users subscribed clubs events
router.get("/getSubEvents", async (req, res, next) => {
    let sql = `SELECT * FROM club_events INNER JOIN club_memberships ON club_events.club_id = club_memberships.club_id WHERE user_id = ? ORDER BY creation_time DESC;`;

    // need to make dynamic
    const result = await database.query(sql, [2]);
    const rows = result[0];

    res.json(rows);
});

// add club
router.post("/addClub", async (req, res, next) => {
    const sql = "INSERT INTO clubs (name, description) VALUES (?, ?);";
    await database.query(sql, [req.body.title, req.body.description]);

    database.addManager(req.body.title, req.user.user_id);

    res.sendStatus(200);
});

// add club member, needs to only be present if not a member
router.post("/addMember", async (req, res, next) => {
    // need to make dynamic
    database.addMember("j", req.user.user_id);

    res.sendStatus(200);
});

// rsvp for event
router.post("/addRSVP", async (req, res, next) => {
    // need to make dynamic
    const sql = "INSERT INTO event_rsvps (event_id, user_id) VALUES (?, ?);";
    await database.query(sql,
        [1, req.user.user_id]
    );

    res.sendStatus(200);
});

// delete an rsvp
router.post("/deleteRSVP", async (req, res, next) => {
    // need to make dynamic
    const sql = "DELETE FROM event_rsvps WHERE event_id = ? AND user_id = ?;";
    await database.query(sql,
        [1, req.user.user_id]
    );

    res.sendStatus(200);
});



// === User and manager routes ===
// delete user from club
router.post("/deleteMember", async (req, res, next) => {
    // will need to get the user_id via first name look up for club manager
    // need to make dynamic
    database.removeMember("j", req.user.user_id);

    res.sendStatus(200);
});

// get all posts for a specific club
router.get("/getClubPosts", async (req, res, next) => {
    let sql = `SELECT * FROM club_posts WHERE club_id = ? ORDER BY creation_time DESC;`;

    // need to make dynamic
    const result = await database.query(sql, [1]);
    const rows = result[0];

    res.json(rows);
});

// get all events for a specific club
router.get("/getClubEvents", async (req, res, next) => {
    let sql = `SELECT * FROM club_events WHERE club_id = ? ORDER BY creation_time DESC;`;

    // need to make dynamic
    const result = await database.query(sql, [1]);
    const rows = result[0];

    res.json(rows);
});



// === Manager routes ===
// add club manager
router.post("/addManager", async (req, res, next) => {
    // need to make dynamic
    database.addManager("testing", req.user.user_id);

    res.sendStatus(200);
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

    res.sendStatus(200);
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

    res.sendStatus(200);
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

    res.sendStatus(200);
});

// delete post
router.post("/deletePost", async (req, res, next) => {
    // need to make dynamic
    const club_query = "SELECT club_id FROM clubs WHERE name = ?;";
    let get_club_id = await database.query(club_query, ["Book Club"]);
    let clubs_id = get_club_id[0][0].club_id;

    // check if manager
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

    res.sendStatus(200);
});

// delete manager
router.post("/deleteManager", async (req, res, next) => {
    // need to make dynamic
    const club_query = "SELECT club_id FROM clubs WHERE name = ?;";
    let get_club_id = await database.query(club_query, ["g"]);
    let clubs_id = get_club_id[0][0].club_id;

    // need to make dynamic
    // check if manager
    const manager_query = "SELECT is_manager FROM club_memberships WHERE user_id = ? AND club_id = ?;";
    let manager_check = (await database.query(manager_query, [3, clubs_id]))[0][0];

    if(manager_check){
        if(manager_check.is_manager){
            // need to make dynamic
            const membership_query = "SELECT * FROM club_memberships WHERE user_id = ? AND club_id = ?;";
            let has_membership = (await database.query(membership_query, [3, clubs_id]))[0][0];

            if(has_membership){
                // need to make dynamic
                const sql = "UPDATE club_memberships SET is_manager = FALSE WHERE user_id = ? AND club_id = ?;";
                await database.query(sql, [3, clubs_id]);
            } else {
                console.log("The user is not a manager");
            }
        } else {
            console.log("You are not a manager");
        }
    } else {
        console.log("You are not a member");
    }

    res.sendStatus(200);
});

// delete event
router.post("/deleteEvent", async (req, res, next) => {
    // need to make dynamic
    const club_query = "SELECT club_id FROM clubs WHERE name = ?;";
    let get_club_id = await database.query(club_query, ["Book Club"]);
    let clubs_id = get_club_id[0][0].club_id;

    // check if manager
    const manager_query = "SELECT is_manager FROM club_memberships WHERE user_id = ? AND club_id = ?;";
    let manager_check = (await database.query(manager_query, [req.user.user_id, clubs_id]))[0][0];

    if(manager_check){
        if(manager_check.is_manager){
            // need to make dynamic
            const sql = "DELETE FROM club_events WHERE event_id = ?;";
            await database.query(sql, [1]);
        } else {
            console.log("Not a manager");
        }
    } else {
        console.log("Not a member");
    }

    res.sendStatus(200);
});

// get rsvps
router.get("/getRSVP", async (req, res, next) => {
    // need to make dynamic
    const club_query = "SELECT club_id FROM clubs WHERE name = ?;";
    let get_club_id = await database.query(club_query, ["Book Club"]);
    let clubs_id = get_club_id[0][0].club_id;

    // check if manager
    const manager_query = "SELECT is_manager FROM club_memberships WHERE user_id = ? AND club_id = ?;";
    let manager_check = (await database.query(manager_query, [1, clubs_id]))[0][0];

    if(manager_check){
        if(manager_check.is_manager){
            // need to make dynamic
            const sql = "SELECT * FROM event_rsvps INNER JOIN club_events ON event_rsvps.event_id = club_events.event_id WHERE club_events.club_id = ?;";
            const result = await database.query(sql, [1]);
            const rows = result[0];
            return res.status(200).json(rows);
        // eslint-disable-next-line no-else-return
        } else {
            console.log("Not a manager");
        }
    } else {
        console.log("Not a member");
    }

    res.sendStatus(400);
});



// set routes and export
module.exports = router;