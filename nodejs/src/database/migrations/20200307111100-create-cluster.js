'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('cluster', {
        cluster_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
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
    return queryInterface.dropTable('cluster');
  }
};