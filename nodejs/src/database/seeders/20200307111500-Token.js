const util = require('../../util');

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
        'Tokens',
        [
            {
                token: util.token_manager.createToken("1"),
                created_on:  new Date(),
                user_id: 1
            },
            {
                token: util.token_manager.createToken("2"),
                created_on:  new Date(),
                user_id: 2
            }
        ],
        {},
    ),

    down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Tokens', null, {}),
};