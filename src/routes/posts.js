const express = require("express");
const database = require("../configs/database.js");
const schemas = require("../configs/schemas.js");
const validator = require("../configs/validator.js");
const { notAuthSend401 } = require("../configs/passport.js");
const router = express.Router();


//  === get public posts from all clubs ===
// returns array of posts
router.get(
    "/get_all_public_posts",
    async (req, res, next) => {
        try {
            let sql = `SELECT * FROM club_posts WHERE is_private = 0 ORDER BY creation_time DESC;`;

            const result = await database.query(sql, []);
            const rows = result[0];

            res.status(200).json(rows);
        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    }
);


// === get public posts from a club ===
// requires QUERY club_id
// returns array of posts
router.get(
    "/get_public_posts",
    async (req, res, next) => {
        try {
            let sql = `SELECT * FROM club_posts WHERE is_private = 0 AND club_id = ? ORDER BY creation_time DESC;`;

            const result = await database.query(sql, [req.query.club_id]);
            const rows = result[0];

            res.json(rows);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }
);


// === get posts from user subscribed clubs ===
// permission isAuthenticated
// returns array of posts
router.get(
    "/get_subscribed_club_posts",
    notAuthSend401,
    async (req, res, next) => {
        try {

            let sql = `
                SELECT * FROM club_posts
                INNER JOIN club_memberships ON club_posts.club_id = club_memberships.club_id
                WHERE user_id = ?
                ORDER BY creation_time DESC;
            `;

            const result = await database.query(sql, req.user.user_id);
            const rows = result[0];

            res.json(rows);
        } catch (err) {
            console.error(err);
            res.sendStatus(500);
        }
    }
);


// === get all posts for club ===
// permission isAuthenticated
// permission isMember
// requires QUERY club_id
// returns array of posts
router.get(
    "/get_club_posts",
    notAuthSend401,
    async (req, res, next) => {
        try {

            const userIsMember = await database.userIsMember(
                req.query.club_id,
                req.user.user_id
            );

            if(userIsMember) {
                let sql = `SELECT * FROM club_posts WHERE club_id = ? ORDER BY creation_time DESC;`;
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


// === delete club post ===
// permission isAuthenticated
// permission isManager || isAdmin
// requires club_id
// requires post_id
router.post(
    "/delete_post",
    notAuthSend401,
    async (req, res, next) => {
        try {

            const userIsAuthorized = await database.userIsManagerOrAdmin(
                req.body.club_id,
                req.user.user_id
            );

            if(userIsAuthorized){
                const sql = "DELETE FROM club_posts WHERE post_id = ?;";
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


// === add post to club ===
// permission isAuthenticated
// permission isManager
// requires title
// requires content
// requires is_private
// requires club_id
router.post(
    "/add_post",
    notAuthSend401,
    validator.checkSchema({
        title: schemas.title,
        content: schemas.text,
        is_private: schemas.is_private
    }),
    async (req, res, next) => {
        try {
            const userIsAuthorized = await database.userIsManagerOrAdmin(
                req.body.club_id,
                req.user.user_id
            );

            if(userIsAuthorized) {
                const sql = "INSERT INTO club_posts (title, content, creation_time, is_private, club_id) VALUES (?, ?, NOW(), ?, ?);";
                await database.query(
                    sql,
                    [
                        req.body.title,
                        req.body.content,
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


module.exports = router;
