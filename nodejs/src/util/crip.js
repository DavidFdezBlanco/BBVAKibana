'use strict';
var crypto = require('crypto');

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
var genRandomString = function(length)
{
    return crypto.randomBytes(Math.ceil(length/2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0,length);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
var sha512 = function(password, salt)
{
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};


/**
 * hash password with sha256.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
var sha256 = function(password, salt)
{
    var hash = crypto.createHmac('sha256', salt); /** Hashing algorithm sha256 */
hash.update(password);
    var value = hash.digest('hex');
    return {
        salt:salt,
        passwordHash:value
    };
};

/**
 * Generates a hashed password and a salt
 * @function
 * @param {string} userpassword - Password to encrypt
 */
function saltHashPassword(userpassword)
{
    var salt = genRandomString(16); /** Gives us salt of length 16 */
    var passwordData = sha256(userpassword, salt);
    return{
        salt:passwordData.salt,
        passwordHash: passwordData.passwordHash
    }
}

/**
 * Generates a hashed password and a salt
 * @function
 * @param {string} userpassword - Password to encrypt
 * @param {string} salt - salt for encription
 */
function saltHashPasswordWithSalt(userpassword, salt)
{
    var passwordData = sha256(userpassword, salt);
    return{
        salt:passwordData.salt,
        passwordHash: passwordData.passwordHash
    }
}

module.exports =
    {
        saltHashPassword,
        saltHashPasswordWithSalt
    };