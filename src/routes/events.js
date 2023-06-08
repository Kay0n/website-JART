const express = require("express");
const database = require("../configs/database.js");
const router = express.Router();


// get all events from all clubs that aren't private
router.get("/get_all_public_events", async (req, res, next) => {
    let sql = `SELECT * FROM club_events WHERE is_private = 0 ORDER BY creation_time DESC;`;

    const result = await database.query(sql, []);
    const rows = result[0];

    res.json(rows);
});


// get all non-private events for a club
router.get("/get_public_events", async (req, res, next) => {
    let sql = `SELECT * FROM club_events WHERE is_private = 0 AND club_id = ? ORDER BY creation_time DESC;`;

    // need to make dynamic
    const result = await database.query(sql, [1]);
    const rows = result[0];

    res.json(rows);
});


// get users subscribed clubs events
router.get("/get_subscribed_club_events", async (req, res, next) => {
    let sql = `SELECT * FROM club_events INNER JOIN club_memberships ON club_events.club_id = club_memberships.club_id WHERE user_id = ? ORDER BY creation_time DESC;`;

    // need to make dynamic
    const result = await database.query(sql, [2]);
    const rows = result[0];

    res.json(rows);
});


// get all events for a specific club
router.get("/get_club_events", async (req, res, next) => {
    let sql = `SELECT * FROM club_events WHERE club_id = ? ORDER BY creation_time DESC;`;

    // need to make dynamic
    const result = await database.query(sql, [1]);
    const rows = result[0];

    res.json(rows);
});


// add event
router.post("/add_event", async (req, res, next) => {
    let is_private = (req.body.private === "on" ? true : false);

    // const club_query = "SELECT club_id FROM clubs WHERE name = ?;";
    // let get_club_id = await database.query(club_query, ["g"]);
    // let clubs_id = get_club_id[0][0].club_id;

    console.log(req.query.club_id);
    console.log(req.body);
    var id = Number(req.query.club_id);
    console.log(id);

    const sql = "INSERT INTO club_events (title, description, date, location, creation_time, is_private, club_id) VALUES (?, ?, ?, ?, NOW(), ?, ?);";
    await database.query(sql,
        // eslint-disable-next-line max-len
        [req.body.title, req.body.description, req.body.date, req.body.location, is_private, id]
    );

    res.sendStatus(200);
});


// delete event
router.post("/delete_event", async (req, res, next) => {
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


// get RSVPS for a given club
router.get("/get_RSVP", async (req, res, next) => {
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


// rsvp for event
router.post("/add_RSVP", async (req, res, next) => {
    // need to make dynamic
    const sql = "INSERT INTO event_rsvps (event_id, user_id) VALUES (?, ?);";
    await database.query(sql,
        [1, req.user.user_id]
    );

    res.sendStatus(200);
});


// delete an rsvp
router.post("/delete_RSVP", async (req, res, next) => {
    // need to make dynamic
    const sql = "DELETE FROM event_rsvps WHERE event_id = ? AND user_id = ?;";
    await database.query(sql,
        [1, req.user.user_id]
    );

    res.sendStatus(200);
});


module.exports = router;
