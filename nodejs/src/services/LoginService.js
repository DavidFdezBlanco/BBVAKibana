const tokenService = require('./TokenService');
const models = require('../database/models');
const util = require('../util');
const jwt = require('jsonwebtoken');

/**
 * Checks if there's an existing user and creates a token. If there's no error returns the token
 * @function
 * @param {string} username - usernamee on the request
 * @param {string} passwordNoHashed - password on the request
 */

const getUserId = async (username, passwordNoHashed) => {
    try {
        const auth = await models.User_conn.findOne(
            {
                where:
                    {
                        username,
                    },
            });
        if (auth) {
            console.log(auth.password);

            if (isValidUser(passwordNoHashed, auth.password, auth.salt)) {
                return auth.user_id;
            }
            return new Error('Wrong username or Password');
        }
        return new Error('User not found');
    } catch (error) {
        return new Error(error.message);
    }
};


/**
 * Checks the validity of the password compared to the one stored before
 * @function
 * @param {string} passwordNoHashed - password on the request
 * @param {string} dbPassword - password from the database
 */
function isValidUser(passwordNoHashed, dbPassword, salt) {
    const passwordHashed = util.crip.saltHashPasswordWithSalt(passwordNoHashed, salt);
    if (passwordHashed.passwordHash === dbPassword) {
        return true;
    }
    return false;
}

module.exports = {
    getUserId,
};
