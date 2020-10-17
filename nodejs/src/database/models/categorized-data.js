
module.exports = (sequelize, DataTypes) => {
    const CategorizedData = sequelize.define('CategorizedData', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        clusterLabel: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        subClusterLabel: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        comment: {
            type: DataTypes.STRING(1000),
            allowNull: true
        }
    }, {
        timestamps: false,
        tableName: 'categorizeddata',
    });
    return CategorizedData;
};
