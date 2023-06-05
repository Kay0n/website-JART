/**
 * This file configures the MySQL database connection.
 * It exposes a number of interfaces for interacting with the
 * database through the "database" object.
 *
 */

const mysql = require('mysql2/promise');
const database = {};

// create pool of connections for app use
const pool = mysql.createPool({
    host: "127.0.0.1",
    database: "wdcproject",
    connectionLimit: 10
});



/**
 * Executes a SQL query and returns the results object or execution result respectivley.
 * See mysql.pool for more information.
 * @async
 * @param {string} sql
 * @param {Array} values
 * @returns {Promise<object>}
 */
database.query = (sql, values) => pool.query(sql, values);
database.execute = (sql, values) => pool.execute(sql, values);



/**
 * Checks the connection to the MySQL database.
 * @async
 * @returns {Promise<void>}
 */
database.checkConnection = async () => {
    await pool.getConnection()
        // eslint-disable-next-line no-console
        .then(() => console.log("Successfuly connected to MySQL database\x1b[0m"))
        // eslint-disable-next-line no-console
        .catch(() => console.error("\x1b[31m[ERROR]: Connection to MySQL database failed\x1b[0m"));
};



/**
 * Retrieves a user from the database based on their user ID.
 * @async
 * @param {number} user_id
 * @returns {Promise<Express.User>}
 */
database.getUserFromID = async (user_id) => {
    const sql = "SELECT * FROM users WHERE user_id = ?;";
    return (await database.query(sql, [user_id]))[0][0];
};



/**
 * Retrieves a user from the database based on their email.
 * @async
 * @param {string} email
 * @returns {Promise<Express.User>}
 */
database.getUserFromEmail = async (email) => {
    const sql = "SELECT * FROM users WHERE email = ?;";
    return (await database.query(sql, [email]))[0][0];
};



/**
 * Creates a new user in the database.
 * @async
 * @param {string} email
 * @param {?string} pass
 * @param {string} given_name
 * @param {?string} family_name
 * @param {number} [is_admin=0]
 * @returns {Promise<Express.User>}
 */
database.createUser = async (email, pass, given_name, family_name, is_admin = 0) => {
    const sql = "REPLACE INTO users (email, password, given_name, family_name, is_admin) VALUES (?, ?, ?, ?, ?);";
    let is_admin_int = is_admin ? 1 : 0;
    await database.query(sql, [email, pass, given_name, family_name, is_admin_int]);
    return database.getUserFromEmail(email);
};


database.addMember = async (name, user_id) => {
    const club_query = "SELECT club_id FROM clubs WHERE name = ?;";
    let get_club_id = await database.query(club_query, [name]);
    let clubs_id = get_club_id[0][0].club_id;

    const sql = "INSERT INTO club_memberships (email_notify_posts, email_notify_events, is_manager, user_id, club_id) VALUES (?, ?, ?, ?, ?);";
    await database.query(sql, [false, false, false, user_id, clubs_id]);
};


database.addManager = async (name, user_id) => {
    const club_query = "SELECT club_id FROM clubs WHERE name = ?;";
    let get_club_id = await database.query(club_query, [name]);
    let clubs_id = get_club_id[0][0].club_id;


    const membership_query = "SELECT * FROM club_memberships WHERE user_id = ? AND club_id = ?;";
    let has_membership = (await database.query(membership_query, [user_id, clubs_id]))[0][0];

    if(has_membership){
        const sql = "UPDATE club_memberships SET is_manager = TRUE WHERE user_id = ? AND club_id = ?;";
        await database.query(sql, [user_id, clubs_id]);
    } else {
        const sql = "INSERT INTO club_memberships (email_notify_posts, email_notify_events, is_manager, user_id, club_id) VALUES (?, ?, ?, ?, ?);";
        await database.query(sql, [false, false, true, user_id, clubs_id]);
    }
};



database.removeMember = async (name, user_id) => {
    const club_query = "SELECT club_id FROM clubs WHERE name = ?;";
    let get_club_id = await database.query(club_query, [name]);
    let clubs_id = get_club_id[0][0].club_id;

    const sql = "DELETE FROM club_memberships WHERE user_id = ? AND club_id = ?;";
    await database.query(sql, [user_id, clubs_id]);
};


module.exports = database;
