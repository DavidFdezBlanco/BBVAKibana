'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('subcluster', {
        subcluster_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        cluster_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: {
                    tableName: 'cluster',
                    schema: 'public'
                },
                key: 'id'
            }
        },
        label: {
            type: Sequelize.STRING,
            allowNull: true
        },
        words: {
            type: Sequelize.ARRAY(Sequelize.STRING),
            allowNull: true
        }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('subcluster');
  }
};