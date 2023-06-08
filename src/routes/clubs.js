const express = require("express");
const database = require("../configs/database.js");
const validator = require("../configs/validator.js");
const schemas = require("../configs/schemas.js");
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
            return res.status(500);
        }
    }
);






// === add club ===
// requires title
// requires description
router.post(
    "/add_club",
    validator.checkSchema({
        tite: schemas.title,
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
            if(clubs_matching_name.length){
                res.status(400).json({ errorMessages: [{ title: "This title is already in use" }] });
                return;
            }

            const sql = "INSERT INTO clubs (name, description) VALUES (?, ?);";
            await database.query(sql, [req.body.title, req.body.description]);
            database.addManager(req.body.title, req.user.user_id);

            res.sendStatus(200);
        } catch (err) { res.status(500).json(); }
    }

);


// === add club member ===
// assumes authenticated
// requires club_id
router.post(
    "/add_member",
    async (req, res, next) => {
        try{
            // need to make dynamic
            await database.addMember(req.body.club_id, req.user.user_id);
            return res.sendStatus(200);
        } catch (err) {
            console.error(err);
            return res.status(500);
        }
    }
);


// === remove club member ===
// assumes authenticated
// requires club_id - club to remove from
// requires user_id - user to remove
router.post(
    "/remove_member",
    async (req, res, next) => {

        const user_is_authorized = await database.userIsManagerOrAdmin(
            req.body.club_id,
            req.user.user_id
        );

        if(user_is_authorized || req.user.user_id === req.body.user_id) {
            database.removeMember(req.body.club_id, req.body.user_id);
            res.status(200);
            return;
        }

        res.status(401);
    }
);


// === add club manager ===
// assumes authenticated
// requires club_id
// requires user_id
router.post(
    "/add_manager",
    async (req, res, next) => {
        const user_is_authorized = await database.userIsManagerOrAdmin(
            req.body.club_id,
            req.user.user_id
        );

        if(user_is_authorized) {
            database.addManager(req.body.club_id, req.body.user_id);
            res.status(200);
            return;
        }

        res.status(401);

    }
);


// === delete club ===
// assumes authenticated
// requires club_id
router.post(
    "/delete_club",
    async (req, res, next) => {

        const user_is_authorized = await database.userIsManagerOrAdmin(
            req.body.club_id,
            req.user.user_id
        );

        if(user_is_authorized) {
            const sql = "DELETE FROM clubs WHERE club_id = ?;";
            await database.query(sql, req.body.club_id);
            res.status(200);
            return;
        }

        res.status(401);
    }
);


// === delete manager ===
// assumes authenticated
// requires user_id
// requires club_id
router.post(
    "/remove_manager",
    async (req, res, next) => {

        const user_is_authorized = await database.userIsManagerOrAdmin(
            req.body.club_id,
            req.user.user_id
        );

        if(user_is_authorized) {
            const sql = "UPDATE club_memberships SET is_manager = FALSE WHERE user_id = ? AND club_id = ?;";
            await database.query(sql, [req.body.user_id, req.body.club_id]);
            res.status(200);
            return;
        }

        res.status(401);
    }
);


module.exports = router;

