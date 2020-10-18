
module.exports = {
    up: (queryInterface, Sequelize) => queryInterface.createTable('rawdata', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        comment: {
            type: Sequelize.STRING(1000),
            allowNull: false,
        },
        relative_date: {
            type: Sequelize.STRING,
            allowNull: true
        },
        rating: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        username: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        n_review_user: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        n_photo_user: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        url_user: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        company: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        country: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }),
    down: (queryInterface, Sequelize) => queryInterface.dropTable('rawdata'),
};
