const express = require("express");
const database = require("../configs/database.js");
const validator = require("../configs/validator.js");
const schemas = require("../configs/schemas.js");
const { notAuthSend401 } = require("../configs/passport.js");
const router = express.Router();


//  === get public events from all clubs ===
// returns array of events
router.get(
    "/get_all_public_events",
    validator.checkSchema({

    }),
    async (req, res, next) => {
        try {
            let sql = `SELECT * FROM club_events WHERE is_private = 0 ORDER BY creation_time DESC;`;

            const result = await database.query(sql, []);
            const rows = result[0];

            res.status(200).json(rows);
        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    }
);


//  === get public events from a clubs ===
// requires QUERY club_id
// returns array of events
router.get(
    "/get_public_events",
    async (req, res, next) => {
        try {
            let sql = `SELECT * FROM club_events WHERE is_private = 0 AND club_id = ? ORDER BY creation_time DESC;`;

            const result = await database.query(sql, [req.query.club_id]);
            const rows = result[0];

            res.json(rows);
        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    }
);


// === get events from user subscribed clubs ===
// permission isAuthenticated
// permission isMember
// returns array of events
router.get(
    "/get_subscribed_club_events",
    notAuthSend401,
    async (req, res, next) => {
        try {

            let sql = `
                SELECT * FROM club_events
                INNER JOIN club_memberships ON club_events.club_id = club_memberships.club_id
                WHERE user_id = ?
                ORDER BY creation_time DESC;
            `;

            const result = await database.query(sql, req.user.user_id);
            const rows = result[0];

            res.status(200).json(rows);
        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    }
);


// === get all events for a club ===
// permission isAuthenticated
// permission isMember
// requires QUERY club_id
// returns array of events
router.get(
    "/get_club_events",
    notAuthSend401,
    async (req, res, next) => {
        try {

            const userIsMember = await database.userIsMember(
                req.query.club_id,
                req.user.user_id
            );

            if(userIsMember) {
                let sql = `SELECT * FROM club_events WHERE club_id = ? ORDER BY creation_time DESC;`;
                const result = await database.query(sql, req.query.club_id);
                const rows = result[0];
                res.status(200).json(rows);
                return;
            }

            res.sendStatus(401);
        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }

    }
);


// === add club event ===
// permission isAuthenticated
// permission isManager || isAdmin
// requires title
// requires description
// requires date
// requires location
// requires is_private
// requires club_id
router.post(
    "/add_event",
    notAuthSend401,
    validator.checkSchema({
        title: schemas.title,
        description: schemas.text,
        date: schemas.date,
        location: schemas.location,
        is_private: schemas.club_id,
        club_id: schemas.club_id

    }),
    async (req, res, next) => {
        try {

            if(validator.returnSchemaErrors(req, res)){ return; }

            const userIsAuthorized = await database.userIsManagerOrAdmin(
                req.body.club_id,
                req.user.user_id
            );

            if(userIsAuthorized) {
                const sql = "INSERT INTO club_events (title, description, date, location, creation_time, is_private, club_id) VALUES (?, ?, ?, ?, NOW(), ?, ?);";
                await database.query(
                    sql,
                    [
                        req.body.title,
                        req.body.description,
                        req.body.date,
                        req.body.location,
                        req.body.is_private,
                        req.body.club_id
                    ]
                );
                res.sendStatus(201);
                return;
            }

            res.sendStatus(401);
        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    }
);


// === delete club event ===
// permission isAuthenticated
// permission isManager || isAdmin
// requires club_id
// requires event_id
router.post(
    "/delete_event",
    notAuthSend401,
    async (req, res, next) => {
        try {

            const userIsAuthorized = await database.userIsManagerOrAdmin(
                req.body.club_id,
                req.user.user_id
            );

            if(userIsAuthorized){
                const sql = "DELETE FROM club_events WHERE event_id = ?;";
                await database.query(sql, [req.body.event_id]);
                res.sendStatus(200);
                return;
            }

            res.sendStatus(401);
        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    }
);


// === get event RSVPS for a club ===
// permission isAuthenticated
// permission isMember
// requires QUERY club_id
// returns RSVP array
router.get(
    "/get_RSVP",
    notAuthSend401,
    async (req, res, next) => {
        try {
            const userIsMember = await database.userIsMember(
                req.query.club_id,
                req.user.user_id
            );

            if(userIsMember){

                const sql = `SELECT users.given_name, users.family_name, club_events.title, club_events.date FROM event_rsvps
                            INNER JOIN club_events ON event_rsvps.event_id = club_events.event_id
                            INNER JOIN users ON event_rsvps.user_id = users.user_id
                            WHERE club_events.club_id = ?;`;
                const result = await database.query(sql, req.query.club_id);
                const rows = result[0];
                return res.status(200).json(rows);
            }

            return res.sendStatus(401);
        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    }
);


// === rsvp for event ===
// permission isAuthenticated
// permission isMember
// requires club_id
// requires event_id
router.post(
    "/add_RSVP",
    notAuthSend401,
    async (req, res, next) => {
        try {

            const userIsMember = await database.userIsMember(
                req.body.club_id,
                req.user.user_id
            );

            if(userIsMember){
                const sql = "INSERT INTO event_rsvps (event_id, user_id) VALUES (?, ?);";
                await database.query(
                    sql,
                    [
                        req.body.event_id,
                        req.user.user_id
                    ]
                );

                res.sendStatus(201);
                return;
            }

            res.sendStatus(401);
        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }

    }
);



module.exports = router;
