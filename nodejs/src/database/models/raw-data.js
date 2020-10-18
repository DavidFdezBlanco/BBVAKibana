
module.exports = (sequelize, DataTypes) => {
    const RawData = sequelize.define('Rawdata', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        comment: {
            type: DataTypes.STRING(100000),
            allowNull: false,
        },
        relative_date: {
            type: DataTypes.STRING,
            allowNull: true
        },
        rating: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        n_review_user: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        n_photo_user: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        url_user: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        company: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        timestamps: false,
        tableName: 'rawdata',
    });
    return RawData;
};
