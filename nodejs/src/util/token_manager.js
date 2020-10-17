'use strict';
const jwt = require('jsonwebtoken')
const fs = require('fs');

// PRIVATE and PUBLIC key

var privateKEY  = fs.readFileSync(__dirname+'/keys/private_token.key', 'utf8');
var publicKEY  = fs.readFileSync(__dirname+'/keys/public_token.key', 'utf8');

//TODO: TO Change
var i  = 'Aplifit';                     // Issuer
var s  = 'aplifit@aplifit.com';         // Subject
var a  = 'http://aplifit.com';          // Audience

// SIGNING OPTIONS
var signOptions =
    {
        issuer:  i,
        subject:  s,
        audience:  a,
        expiresIn:  "72h",
        algorithm:  "HS256"
    };

/**
 * Generates a payload
 * @function
 * @param {string} userId - id of the user.
 */
var payloadGen = function(userId)
{
    var payload = {
        data1: userId
    };

    return payload
}

/**
 * Creates a token.
 * @function
 * @param {string} userId - id of the user.
 */
function createToken(userId)
{
    console.log("user id" + userId)
    console.log("privateKEY" + privateKEY)
    var token = jwt.sign(payloadGen(userId), privateKEY, signOptions);
    console.log("Token - " + token)
    return token
}


module.exports =
    {
        createToken
    };