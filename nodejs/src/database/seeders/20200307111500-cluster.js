
module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
        'cluster',
        [
            {
                id: 1000000,
                label: 'sanidad',
                words: "{'limpieza','sanidad'}",
            },
            {
                id: 1000001,
                label: 'personal',
                words: "{'formacion','empleados'}",
            }
        ],
        {},
    ),

    down: (queryInterface, Sequelize) => queryInterface.bulkDelete('cluster', null, {}),
};
