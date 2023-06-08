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
            let sql = `SELECT * FROM clubs ORDER BY number_members;`;
            const result = await database.query(sql, []);
            const rows = result[0];
            return res.status(200).json(rows);
        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
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
            const clubs_matching_name = await database.query(
                "SELECT * FROM clubs WHERE name = ?",
                [req.body.title]
            )[0];
            if(clubs_matching_name){
                res.status(400).json({ errorMessages: [{ title: "This title is already in use" }] });
                return;
            }

            const sql = "INSERT INTO clubs (name, description) VALUES (?, ?);";
            await database.query(sql, [req.body.title, req.body.description]);
            database.addManager(req.body.title, req.user.user_id);

            res.sendStatus(200);

        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    }

);


// === add club member ===
// permission isAuthenticated
// requires club_id
router.post(
    "/add_member",
    notAuthSend401,
    async (req, res, next) => {
        try{
            await database.addMember(req.body.club_id, req.user.user_id);
            return res.sendStatus(200);
        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    }
);


// === remove club member ===
// permission isAuthenticated
// permission isManager
// requires club_id - club to remove from
// requires user_id - user to remove
router.post(
    "/remove_member",
    notAuthSend401,
    async (req, res, next) => {
        try {
            const user_is_authorized = await database.userIsManagerOrAdmin(
                req.body.club_id,
                req.user.user_id
            );

            if(user_is_authorized || req.user.user_id === req.body.user_id) {
                database.removeMember(req.body.club_id, req.body.user_id);
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


// === add club manager ===
// permission isAuthenticated
// permission isManager
// requires club_id
// requires user_id
router.post(
    "/add_manager",
    notAuthSend401,
    async (req, res, next) => {
        try {
            const user_is_authorized = await database.userIsManagerOrAdmin(
                req.body.club_id,
                req.user.user_id
            );

            if(user_is_authorized) {
                database.addManager(req.body.club_id, req.body.user_id);
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
            console.error(err);
            return res.sendStatus(500);
        }
    }
);


// === delete manager ===
// permission isAuthenticated
// permission isManager
// requires user_id
// requires club_id
router.post(
    "/remove_manager",
    notAuthSend401,
    async (req, res, next) => {
        try {
            const user_is_authorized = await database.userIsManagerOrAdmin(
                req.body.club_id,
                req.user.user_id
            );

            if(user_is_authorized) {
                const sql = "UPDATE club_memberships SET is_manager = FALSE WHERE user_id = ? AND club_id = ?;";
                await database.query(sql, [req.body.user_id, req.body.club_id]);
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


module.exports = router;

