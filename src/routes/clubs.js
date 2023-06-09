const express = require("express");
const database = require("../configs/database.js");
const validator = require("../configs/validator.js");
const schemas = require("../configs/schemas.js");
const { notAuthSend401 } = require("../configs/passport.js");
const router = express.Router();


// === get clubs ===
// returns array of clubs
router.get(
    "/get_clubs",
    async (req, res, next) => {
        try{
            let sql = `SELECT * FROM clubs ORDER BY name;`;
            const result = await database.query(sql, []);
            const rows = result[0];
            return res.status(200).json(rows);
        } catch (err) {
            return res.sendStatus(500);
        }
    }
);


// === get subscribed clubs ===
// requires user_id
// returns array of clubs
router.get(
    "/get_subscribed_clubs",
    async (req, res, next) => {
        try{
            let sql = `SELECT clubs.name FROM clubs
                       INNER JOIN club_memberships ON clubs.club_id = club_memberships.club_id
                       WHERE club_memberships.user_id = ?
                       ORDER BY name;`;
            const result = await database.query(sql, [req.user.user_id]);
            const rows = result[0];
            return res.status(200).json(rows);
        } catch (err) {
            return res.sendStatus(500);
        }
    }
);


// === get club members ===
// requires QUERY club_id
// returns array containing members of club
router.get(
    "/get_club_members",
    async (req, res, next) => {
        try{
            let sql = `SELECT users.user_id, users.given_name, users.family_name, users.email, club_memberships.is_manager FROM club_memberships
            INNER JOIN users ON club_memberships.user_id = users.user_id
            WHERE club_id = ?
            ORDER BY is_manager DESC, users.given_name;`;

            const result = await database.query(sql, [req.query.club_id]);
            const rows = result[0];

            res.json(rows);
        } catch (err) {
            res.sendStatus(500);
        }
    }
);


// === get club name ===
// requires QUERY club_id
// returns array containing name of club
router.get(
    "/get_club_name",
    async (req, res, next) => {
        try{
            let sql = `SELECT name FROM clubs WHERE club_id = ?;`;

            const result = await database.query(sql, [req.query.club_id]);
            const rows = result[0];

            res.json(rows);
        } catch (err) {
            res.sendStatus(500);
        }
    }
);


// === get club id ===
// requires QUERY club_id
// returns array containing name of club
router.get(
    "/get_club_id",
    async (req, res, next) => {
        try{
            let sql = `SELECT club_id FROM clubs WHERE club_id = ?;`;

            const result = await database.query(sql, [req.query.club_id]);
            const rows = result[0];

            res.json(rows);
        } catch (err) {
            res.sendStatus(500);
        }
    }
);


// === add club ===
// permission isAuthenticated
// requires title
// requires description
router.post(
    "/add_club",
    notAuthSend401,
    validator.checkSchema({
        title: schemas.title,
        description: schemas.text
    }),
    async (req, res) => {
        try {

            if(validator.returnSchemaErrors(req, res)){ return; }

            // check if club name exists
            const clubs_matching_name = (await database.query(
                "SELECT * FROM clubs WHERE name = ?",
                [req.body.title]
            ))[0];
            if(clubs_matching_name.length){
                res.status(400).json({ errorMessages: [{ title: "This title is already in use" }] });
                return;
            }

            // create club
            const sql = "INSERT INTO clubs (name, description) VALUES (?, ?);";
            await database.query(sql, [req.body.title, req.body.description]);

            // make user manager of club
            const new_club_id = (await database.query(
                "SELECT * FROM clubs WHERE name = ?",
                [req.body.title]
            ))[0][0].club_id;
            database.setMemberState(new_club_id, req.user.user_id, true);
            database.setManagerState(new_club_id, req.user.user_id, true);

            res.sendStatus(200);

        } catch (err) {
            res.sendStatus(500);
        }
    }

);


// === set club member state ===
// permission isAuthenticated
// permission isManager
// requires club_id
// requires OPTIONAL user_id - user to set
// requires new_state
router.post(
    "/set_member",
    notAuthSend401,
    async (req, res, next) => {
        try {

            if(req.body.user_id){
                database.setMemberState(req.body.club_id, req.body.user_id, req.body.new_state);
                return;
            }
            database.setMemberState(req.body.club_id, req.user.user_id, req.body.new_state);
            res.sendStatus(200);
        } catch (err) {
            res.sendStatus(500);
        }
    }
);


// === set club manager sate ===
// permission isAuthenticated
// permission isManager
// requires club_id
// requires user_id
// requires new_state
router.post(
    "/set_manager",
    notAuthSend401,
    async (req, res, next) => {
        try {
            const user_is_authorized = await database.userIsManagerOrAdmin(
                req.body.club_id,
                req.user.user_id
            );

            if(user_is_authorized) {
                // make user if setting
                if(req.body.new_state){
                    await database.setMemberState(
                        req.body.club_id,
                        req.body.user_id,
                        true
                    );
                }

                // set state
                await database.setManagerState(
                    req.body.club_id,
                    req.body.user_id,
                    req.body.new_state
                );
                res.sendStatus(200);
                return;
            }

            res.sendStatus(401);
        } catch (err) {
            res.sendStatus(500);
        }
    }
);


// === delete club ===
// permission isAuthenticated
// permission isManager
// requires club_id
router.post(
    "/delete_club",
    notAuthSend401,
    async (req, res, next) => {
        try {
            const user_is_authorized = await database.userIsManagerOrAdmin(
                req.body.club_id,
                req.user.user_id
            );

            if(user_is_authorized) {
                const sql = "DELETE FROM clubs WHERE club_id = ?;";
                await database.query(sql, req.body.club_id);
                res.sendStatus(200);
                return;
            }

            res.sendStatus(401);
        } catch (err) {
            res.sendStatus(500);
        }
    }
);


module.exports = router;

