

module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable('subcluster', {
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
        cluster_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: {
                    tableName: 'cluster',
                    schema: 'public',
                },
                key: 'id',
            },
        }
    }),
    down: (queryInterface, Sequelize) => queryInterface.dropTable('subcluster'),
};
