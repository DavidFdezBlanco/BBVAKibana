
module.exports = (sequelize, DataTypes) => {
    const Cluster = sequelize.define('Cluster', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        label: {
            type: DataTypes.STRING,
            allowNull: true
        },
        words: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true
        }
    }, {
        timestamps: false,
        tableName: 'cluster'
    });
    return Cluster;
};