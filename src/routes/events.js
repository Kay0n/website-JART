const express = require("express");
const database = require("../configs/database.js");
const validator = require("../configs/validator.js");
const schemas = require("../configs/schemas.js");
const router = express.Router();


//  === get public events from all clubs ===
// returns array of events
router.get(
    "/get_all_public_events",
    validator.checkSchema({

    }),
    async (req, res, next) => {
        let sql = `SELECT * FROM club_events WHERE is_private = 0 ORDER BY creation_time DESC;`;

        const result = await database.query(sql, []);
        const rows = result[0];

        res.json(rows);
    }
);


//  === get public events from a clubs ===
// returns array of events
router.get(
    "/get_public_events",
    validator.checkSchema({

    }),
    async (req, res, next) => {
        let sql = `SELECT * FROM club_events WHERE is_private = 0 AND club_id = ? ORDER BY creation_time DESC;`;

        // need to make dynamic
        const result = await database.query(sql, [1]);
        const rows = result[0];

        res.json(rows);
    }
);


// === get events from user subscribed clubs ===
// assumes authenticated
// assumes member
// returns array of events
router.get(
    "/get_subscribed_club_events",
    async (req, res, next) => {

        let sql = `
            SELECT * FROM club_events
            INNER JOIN club_memberships ON club_events.club_id = club_memberships.club_id
            WHERE user_id = ?
            ORDER BY creation_time DESC;
        `;
        const result = await database.query(sql, req.user.user_id);
        const rows = result[0];
        res.status(200).json(rows);
    }
);


// === get all events for club ===
// assumes authenticated
// assumes member
// requires QUERY club_id
// returns array of events
router.get(
    "/get_club_events",
    async (req, res, next) => {

        const userIsMember = await database.userIsMember(
            req.query.club_id,
            req.user.user_id
        );

        if(userIsMember) {
            let sql = `SELECT * FROM club_events WHERE club_id = ? ORDER BY creation_time DESC;`;
            const result = await database.query(sql, req.query.club_id);
            const rows = result[0];
            res.status(200).json(rows);
        }

        res.status(401);

    }
);


// === add club event ===
// assumes authenticated
// assumes authorized
// requires title
// requires description
// requires date
// requires location
// requires is_private
// requires club_id
router.post(
    "/add_event",
    validator.checkSchema({
        title: schemas.title,
        description: schemas.description,
        date: schemas.date,
        location: schemas.location,
        is_private: schemas.club_id,
        club_id: schemas.club_id

    }),
    async (req, res, next) => {

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
            res.status(201);
            return;
        }

        res.status(401);

    }
);


// === delete club event ===
// assumes authenticated
// assumes authorized
// requires club_id
// requires event_id
router.post(
    "/delete_event",
    async (req, res, next) => {

        const userIsAuthorized = await database.userIsManagerOrAdmin(
            req.body.club_id,
            req.user.user_id
        );

        if(userIsAuthorized){
            const sql = "DELETE FROM club_events WHERE event_id = ?;";
            await database.query(sql, [req.body.event_id]);
            res.status(200);
            return;
        }

        res.status(401);

    }
);


// === get event RSVPS for a club ===
// assumes authenticated
// assumes member
// requires QUERY club_id
router.get(
    "/get_RSVP",
    async (req, res, next) => {

        const userIsMember = await database.userIsMember(
            req.query.club_id,
            req.user.user_id
        );

        if(userIsMember){

            const sql = "SELECT * FROM event_rsvps INNER JOIN club_events ON event_rsvps.event_id = club_events.event_id WHERE club_events.club_id = ?;";
            const result = await database.query(sql, req.query.club_id);
            const rows = result[0];
            return res.status(200).json(rows);
        }

        res.status(401);
    }
);


// rsvp for event
router.post(
    "/add_RSVP",
    validator.checkSchema({

    }),
    async (req, res, next) => {
        // need to make dynamic
        const sql = "INSERT INTO event_rsvps (event_id, user_id) VALUES (?, ?);";
        await database.query(sql,
            [1, req.user.user_id]
        );

        res.sendStatus(200);
    }
);

// delete an rsvp
router.post(
    "/delete_RSVP",
    validator.checkSchema({

    }),
    async (req, res, next) => {
        // need to make dynamic
        const sql = "DELETE FROM event_rsvps WHERE event_id = ? AND user_id = ?;";
        await database.query(sql,
            [1, req.user.user_id]
        );

        res.sendStatus(200);
    }
);


module.exports = router;
