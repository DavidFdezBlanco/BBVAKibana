
module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable('ratings', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        punctuation: {
            type: Sequelize.FLOAT,
            allowNull: false,
        },
        comment: {
            type: Sequelize.STRING(1000),
            allowNull: true
        },
        date: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        lat: {
            type: Sequelize.FLOAT,
            allowNull: true,
        },
        lng: {
            type: Sequelize.FLOAT,
            allowNull: true,
        },
        country: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        company: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        cluster_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: {
                    tableName: 'cluster',
                    schema: 'public',
                },
                key: 'id',
            },
        },
        subcluster_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: {
                    tableName: 'subcluster',
                    schema: 'public',
                },
                key: 'id',
            },
        },
    }),
    down: (queryInterface, Sequelize) => queryInterface.dropTable('ratings'),
};
