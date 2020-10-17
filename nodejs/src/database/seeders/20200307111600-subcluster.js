
module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.bulkInsert(
        'subcluster',
        [
            {
                id: 2000000,
                label: 'covid',
                words: "{'gel','higiene'}",
                cluster_id: 1000000
            },
            {
                id: 2000001,
                label: 'seguridad',
                words: "{'policias','seguro'}",
                cluster_id: 1000001
            }
        ],
        {},
    ),

    down: (queryInterface, Sequelize) => queryInterface.bulkDelete('subcluster', null, {}),
};
