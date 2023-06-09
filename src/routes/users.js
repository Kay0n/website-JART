const express = require("express");
const database = require("../configs/database.js");
const validator = require("../configs/validator.js");
const schemas = require("../configs/schemas.js");
const passwordUtils = require("../configs/bcrypt.js");
const { notAuthSend401 } = require("../configs/passport.js");
const router = express.Router();


// === update user settings ===
// permission isAuthenticated
// requires family_name: string
// requires given_name: string
// optional password: string, > 7 letters
// returms 201 success
router.post(
    '/update_user_settings',
    notAuthSend401,
    validator.checkSchema({
        given_name: schemas.given_name,
        family_name: schemas.family_name,
        email: schemas.email,
        password: schemas.passwordOptional
    }),
    async (req, res) => {
        try {

            if(validator.returnSchemaErrors(req,res)){ return; }

            let hashedPassword;
            if(req.body.password){
                hashedPassword = passwordUtils.hashPassword(req.body.password);
            } else {
                hashedPassword = req.user.password;
            }

            const sql = `
                UPDATE users
                SET given_name = ?,
                    family_name = ?,
                    email = ?,
                    password = ?
                WHERE user_id = ?;
            `;

            await database.query(sql, [
                req.body.given_name,
                req.body.family_name,
                req.body.email,
                hashedPassword,
                req.user.user_id
            ]).catch((error) => {
                console.error('Could not update user settings:', error);
                return res.sendStatus(500);
            });

            return res.sendStatus(201);
        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }
    }
);


// === update user notifications for a given club ===
// permission isAuthenticated
// permission isMembers
// requires club_id
// requires email_notify_posts
// requires email_notify_events
router.post(
    '/update_club_notifications',
    notAuthSend401,
    validator.checkSchema({
        email_notify_posts: schemas.email_notify_posts,
        email_notify_events: schemas.email_notify_events,
        user_id: schemas.user_id,
        club_id: schemas.club_id
    }),
    async (req, res) => {
        try {
            if(validator.returnSchemaErrors(req,res)){ return; }

            const userIsMember = await database.userIsMember(
                req.body.club_id,
                req.user.user_id
            );

            if(userIsMember) {

                const sql = `
                    UPDATE club_memberships
                    SET email_notify_posts = ?, email_notify_events = ?
                    WHERE user_id = ? AND club_id = ?;
                `;

                await database.query(sql, [
                    req.body.email_notify_posts,
                    req.body.email_notify_events,
                    req.user.user_id,
                    req.body.club_id
                ]);

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

// === get user object ===
// permission isAuthenticated
// returns user object
router.post(
    '/get_user',
    notAuthSend401,
    async (req, res) => {
        try {
            const user_object = await database.getUserFromID(req.user.user_id);
            res.status(200).json(user_object);
        } catch (err) {
            console.error(err);
            return res.sendStatus(500);
        }

    }
);

module.exports = router;

