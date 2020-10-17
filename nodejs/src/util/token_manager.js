
const jwt = require('jsonwebtoken');
const fs = require('fs');

// PRIVATE and PUBLIC key

const privateKEY = fs.readFileSync(`${__dirname}/keys/private_token.key`, 'utf8');
const publicKEY = fs.readFileSync(`${__dirname}/keys/public_token.key`, 'utf8');

// TODO: TO Change
const i = 'Aplifit'; // Issuer
const s = 'aplifit@aplifit.com'; // Subject
const a = 'http://aplifit.com'; // Audience

// SIGNING OPTIONS
const signOptions =
    {
        issuer: i,
        subject: s,
        audience: a,
        expiresIn: '72h',
        algorithm: 'HS256',
    };

/**
 * Generates a payload
 * @function
 * @param {string} userId - id of the user.
 */
const payloadGen = function (userId) {
    const payload = {
        data1: userId,
    };

    return payload;
};

/**
 * Creates a token.
 * @function
 * @param {string} userId - id of the user.
 */
function createToken(userId) {
    console.log(`user id${userId}`);
    console.log(`privateKEY${privateKEY}`);
    const token = jwt.sign(payloadGen(userId), privateKEY, signOptions);
    console.log(`Token - ${token}`);
    return token;
}


module.exports =
    {
        createToken,
    };
