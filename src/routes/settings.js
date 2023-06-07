const express = require("express");
const database = require("../configs/database.js");
const validator = require("../configs/validator.js");
const schemas = require("../configs/schemas.js");
const passwordUtils = require("../configs/bcrypt.js");
const router = express.Router();



// updateNotificationsRoute - POST /update_notifications
router.post('/update_notifications', validator.checkSchema(schemas.notificationSchema), async (req, res) => {

    const errorMessages = validator.getSchemaErrors(req);
    if (errorMessages.length) {
        return res.status(400).json({ errorMessages });
    }

    const sql = `
    UPDATE club_memberships
    SET ? = ?
    WHERE user_id = ? AND club_id = ?;
    `;

    await database.query(sql, [
        req.body.notification_type,
        req.body.newState,
        req.user.user_id,
        req.body.club_id
    ]).catch((error) => {
        console.error('Could not update notifications:', error);
        return res.status(500);
    });

    return res.status(201);
});



// update user settings - password is optional in body
router.post('/update_settings', validator.checkSchema(schemas.userSettingsSchema), async (req, res) => {

    const errorMessages = validator.getSchemaErrors(req);
    if (errorMessages.length) {
        return res.status(400).json({ errorMessages });
    }

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
});


module.exports = router;

