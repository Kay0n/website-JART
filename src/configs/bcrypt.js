const bcrypt = require("bcrypt");
const saltRounds = 10;
const passwordUtils = {};



/**
 * Retrieves a user from the database based on their email.
 * @async
 * @param {string} plainPassword
 * @returns {Promise<string>}
 */
passwordUtils.hashPassword = async (plainPassword) => {
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds)
    .catch(() => {
        throw new Error('Error hashing password');
    });
    return hashedPassword;
};



/**
 * Retrieves a user from the database based on their email.
 * @async
 * @param {string} plainPassword
 * @param {string} hashedPassword
 * @returns {Promise<boolean>}
 */
passwordUtils.comparePasswords = async (plainPassword, hashedPassword) => {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword)
    .catch(() => {
        throw new Error('Error comparing passwords');
    });
    return isMatch;
};



module.exports = passwordUtils;
