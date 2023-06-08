const express = require("express");
const database = require("../configs/database.js");
const router = express.Router();


// get all posts from all clubs that aren't private
router.get("/get_all_public_posts", async (req, res, next) => {
    let sql = `SELECT * FROM club_posts WHERE is_private = 0 ORDER BY creation_time DESC;`;

    const result = await database.query(sql, [])
    .catch(() => res.send(500));
    const rows = result[0];

    res.json(rows);
});


// get all non-private posts for a club
router.get("/get_public_posts", async (req, res, next) => {
    let sql = `SELECT * FROM club_posts WHERE is_private = 0 AND club_id = ? ORDER BY creation_time DESC;`;

    // need to make dynamic
    const result = await database.query(sql, [1]);
    const rows = result[0];

    res.json(rows);
});


// get users subscribed clubs posts
router.get("/get_subscribed_club_posts", async (req, res, next) => {
    let sql = `SELECT * FROM club_posts INNER JOIN club_memberships ON club_posts.club_id = club_memberships.club_id WHERE user_id = ? ORDER BY creation_time DESC;`;

    // need to make dynamic
    const result = await database.query(sql, [2]);
    const rows = result[0];

    res.json(rows);
});


// get all posts for a specific club
router.get("/get_club_posts", async (req, res, next) => {
    let sql = `SELECT * FROM club_posts WHERE club_id = ? ORDER BY creation_time DESC;`;

    // need to make dynamic
    const result = await database.query(sql, [1]);
    const rows = result[0];

    res.json(rows);
});


// delete post
router.post("/delete_post", async (req, res, next) => {
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


// add post
router.post("/add_post", async (req, res, next) => {
    let is_private = (req.body.private === "on" ? true : false);

//     const club_query = "SELECT club_id FROM clubs WHERE name = ?;";
//     let get_club_id = await database.query(club_query, ["g"]);
//     let clubs_id = get_club_id[0][0].club_id;
    console.log(req.query.club_id);
    console.log(req.body);
    var id = Number(req.query.club_id);
    console.log(id);


    const sql = "INSERT INTO club_posts (title, content, creation_time, is_private, club_id) VALUES (?, ?, NOW(), ?, ?);";
    await database.query(sql,
        [req.body.title, req.body.content, is_private, id]
    );

    res.sendStatus(200);
});


module.exports = router;
