const express = require("express");
const database = require("../configs/database.js");
const router = express.Router();


// get clubs
router.get("/get_clubs", async (req, res, next) => {
    let sql = `SELECT * FROM clubs ORDER BY number_members;`;

    const result = await database.query(sql, []);
    const rows = result[0];

    res.json(rows);
    res.sendStatus(200);
});


// add club
router.post("/add_club", async (req, res, next) => {
    const sql = "INSERT INTO clubs (name, description) VALUES (?, ?);";
    await database.query(sql, [req.body.title, req.body.description]);

    database.addManager(req.body.title, req.user.user_id);

    res.sendStatus(200);
});


// add club member, needs to only be present if not a member
router.post("/add_member", async (req, res, next) => {
    // need to make dynamic
    database.addMember("Book Club", req.user.user_id);

    res.sendStatus(200);
});


// delete user from club
router.post("/remove_member", async (req, res, next) => {
    // will need to get the user_id via first name look up for club manager
    // need to make dynamic
    database.removeMember("j", req.user.user_id);

    res.sendStatus(200);
});


// add club manager
router.post("/add_manager", async (req, res, next) => {
    // need to make dynamic
    database.addManager("testing", req.user.user_id);

    res.sendStatus(200);
});


// delete club
router.post("/delete_club", async (req, res, next) => {
    // need to make dynamic
    // check if club manager
    // const club_query = "SELECT club_id FROM clubs WHERE club_id = ?;";
    // let get_club_id = await database.query(club_query, [req.body.club_id]);
    // let clubs_id = get_club_id[0][0].club_id;
    var id = Number(req.query.club_id);
    console.log(id);

    const manager_query = "SELECT is_manager FROM club_memberships WHERE user_id = ? AND club_id = ?;";
    let manager_check = (await database.query(manager_query, [req.user.user_id, id]))[0][0];

    if(manager_check){
        if(manager_check.is_manager){
            // need to make dynamic
            const sql = "DELETE FROM clubs WHERE club_id = ?;";
            await database.query(sql, [id]);
        } else {
            console.log("Not a manager");
        }
    } else {
        console.log("Not a member");
    }

    res.sendStatus(200);
});


// delete manager
router.post("/remove_manager", async (req, res, next) => {
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


module.exports = router;

