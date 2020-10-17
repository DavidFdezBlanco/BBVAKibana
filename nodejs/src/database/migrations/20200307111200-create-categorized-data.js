
module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable('categorizeddata', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        clusterLabel: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        subClusterLabel: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        comment: {
            type: Sequelize.STRING(1000),
            allowNull: true
        },
    }),
    down: (queryInterface, Sequelize) => queryInterface.dropTable('categorizeddata'),
};
