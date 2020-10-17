const util = require("../../util");

let psw = util.crip.saltHashPassword("password")
let psw2 = util.crip.saltHashPassword("password2")

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
        'User_conns',
        [
            {
                user_id: 1,
                username: "Lorem Ipsum",
                password: psw.passwordHash,
                salt: psw.salt,
                activation_code: "ssalsf",
                forgotten_password_code: "jsjsla",
                forgotten_password_time: new Date(),
                remember_code: "yes",
                created_on: new Date(),
                last_login: new Date(),
                active: true,
                banned: false,
                newsletter: true,
                n_comments: 21
            },
            {
                user_id: 2,
                username: "Dolor Sit",
                password: psw2.passwordHash,
                salt: psw2.salt,
                activation_code: "ssalAf",
                forgotten_password_code: "jsssla",
                forgotten_password_time: new Date(),
                remember_code: "yes",
                created_on: new Date(),
                last_login: new Date(),
                active: true,
                banned: false,
                newsletter: true,
                n_comments: 21
            },
        ],
        {},
    ),

    down: (queryInterface, Sequelize) => queryInterface.bulkDelete('User_conns', null, {}),
};
