'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('ratings', {
            rating_id: {
                type: Sequelize.STRING,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            punctuation:{
                type: Sequelize.FLOAT,
                allowNull: false
            },
            comment: {
                type: Sequelize.STRING,
                allowNull: true
            },
            date: {
                type: Sequelize.DATE,
                allowNull: true
            },
            lat: {
                type: Sequelize.FLOAT,
                allowNull: true
            },
            lng: {
                type: Sequelize.FLOAT,
                allowNull: true
            },
            country: {
                type: Sequelize.STRING,
                allowNull: true
            },
            cluster_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: 'cluster',
                        schema: 'public'
                    },
                    key: 'id'
                }
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('ratings');
    }
};