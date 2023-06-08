const express = require("express");
const database = require("../configs/database.js");
const schemas = require("../configs/schemas.js");
const validator = require("../configs/validator.js");
const router = express.Router();


//  === get public posts from all clubs ===
// returns array of posts
router.get(
    "/get_all_public_posts",
    validator.checkSchema({

    }),
    async (req, res, next) => {
        let sql = `SELECT * FROM club_posts WHERE is_private = 0 ORDER BY creation_time DESC;`;

        const result = await database.query(sql, []);
        const rows = result[0];

        res.status(200).json(rows);
    }
);


// === get public posts from a club ===
// returns array of posts
router.get(
    "/get_public_posts",
    async (req, res, next) => {
        let sql = `SELECT * FROM club_posts WHERE is_private = 0 AND club_id = ? ORDER BY creation_time DESC;`;

        const result = await database.query(sql, [1]);
        const rows = result[0];

        res.json(rows);
    }
);


// === get posts from user subscribed clubs ===
// permission isAuthenticated
// permission isMember
// returns array of posts
router.get(
    "/get_subscribed_club_posts",
    async (req, res, next) => {

        let sql = `
            SELECT * FROM club_posts
            INNER JOIN club_memberships ON club_posts.club_id = club_memberships.club_id
            WHERE user_id = ?
            ORDER BY creation_time DESC;
        `;

        const result = await database.query(sql, req.user.user_id);
        const rows = result[0];

        res.json(rows);
    }
);


// === get all posts for club ===
// permission isAuthenticated
// permission isMember
// requires QUERY club_id
// returns array of posts
router.get(
    "/get_club_posts",
    async (req, res, next) => {

        const userIsMember = await database.userIsMember(
            req.query.club_id,
            req.user.user_id
        );

        if(userIsMember) {
            let sql = `SELECT * FROM club_posts WHERE club_id = ? ORDER BY creation_time DESC;`;
            const result = await database.query(sql, req.query.club_id);
            const rows = result[0];
            res.status(200).json(rows);
        }

        res.status(401);

    }
);


// === delete club post ===
// permission isAuthenticated
// permission isManager || isAdmin
// requires club_id
// requires post_id
router.post(
    "/delete_post",
    validator.checkSchema({

    }),
    async (req, res, next) => {

        const userIsAuthorized = await database.userIsManagerOrAdmin(
            req.body.club_id,
            req.user.user_id
        );

        if(userIsAuthorized){
            const sql = "DELETE FROM club_posts WHERE post_id = ?;";
            await database.query(sql, [req.body.event_id]);
            res.status(200);
            return;
        }

        res.status(401);

    }
);


// === add post to club ===
// requires club_id: string
// requires given_name: string
// optional password: string, > 7 letters
// returms 201 success
router.post(
    "/add_post",
    validator.checkSchema({
        title: schemas.title,
        content: schemas.text,
        is_private: schemas.is_private,
        club_id: schemas.club_id
    }),
    async (req, res, next) => {
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
            res.status(201);
            return;
        }

        res.status(401);

    }
);


module.exports = router;
