

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable('cluster', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        label: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        words: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }),
    down: (queryInterface, Sequelize) => queryInterface.dropTable('cluster'),
};
