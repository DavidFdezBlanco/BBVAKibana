
module.exports = (sequelize, DataTypes) => {
    const Subcluster = sequelize.define('Subcluster', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        label: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        words: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true,
        },
    }, {
        timestamps: false,
        tableName: 'subcluster',
    });
    Subcluster.associate = function (models) {
        Subcluster.belongsTo(models.Cluster, {
            foreignKey: {
                name: 'cluster_id',
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            targetKey: 'id',
        });
    };
    return Subcluster;
};
