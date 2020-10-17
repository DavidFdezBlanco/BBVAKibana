const util = require('../util');
const models = require("../database/models");

/**
 * Creates a new token
 * @function
 * @param {string} user_id - user_id retourned from the db request
 */

const createToken =  async (user_id) =>
{
    try {
        console.log("here")
        newToken = util.token_manager.createToken(user_id);
        console.log("new token" + newToken);
        return instertToken(newToken, user_id);
    }catch (error) {
        throw new Error("Token creation error")
    }
}

/**
 * Creates a new token
 * @function
 * @param {string} token - new token created
 * @param {string} user_id - user id linked to the token
 */

const instertToken = async (token, user_id) => {
    try
    {
        tokenToCreate =
            {
                "token": token,
                "created_on": new Date(),
                "user_id": user_id
            };
        console.log(tokenToCreate);
        const newToken = await models.Token.create(tokenToCreate);
        return newToken;
    }
    catch (error)
    {
        throw new Error("Token insertion error")
    }
}


module.exports = {
    createToken
}
