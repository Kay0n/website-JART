const express = require("express");
const database = require("../configs/database.js");
const validator = require("../configs/validator.js");
const schemas = require("../configs/schemas.js");
const passwordUtils = require("../configs/bcrypt.js");
const router = express.Router();


// === update user settings ===
// requires family_name: string
// requires given_name: string
// optional password: string, > 7 letters
// returms 201 success
router.post(
    '/update_user_settings',
    validator.checkSchema({
        given_name: schemas.given_name,
        family_name: schemas.family_name,
        email: schemas.email,
        password: schemas.passwordOptional
    }),
    async (req, res) => {

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
            return res.status(500);
        });

        return res.status(201);
    }
);


// === update user notifications for a given club ===
// requires club_id: number
// requires email_notify_posts: boolean
// requires email_notify_events: boolean
// returms 201 success
router.post(
    '/update_club_notifications',
    validator.checkSchema({
        email_notify_posts: schemas.email_notify_posts,
        email_notify_events: schemas.email_notify_events,
        user_id: schemas.user_id,
        club_id: schemas.club_id
    }),
    async (req, res) => {

        const errorMessages = validator.getSchemaErrors(req);
        if (errorMessages.length) {
            return res.status(400).json({ errorMessages });
        }

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
        ]).catch((error) => {
            console.error('Could not update notifications:', error);
            return res.status(500);
        });

        return res.status(201);
    }
);


module.exports = router;

