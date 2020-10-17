module.exports = (sequelize, DataTypes) => {
    const Rating = sequelize.define('Rating', {
        rating_id: {
            type: DataTypes.STRING,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        punctuation: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        comment: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        lat: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        lng: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        timestamps: false,
        tableName: 'ratings',
    });
    Rating.associate = function (models) {
        // associations can be defined here
        Rating.belongsTo(models.Cluster, {
            foreignKey: {
                name: 'cluster_id',
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            targetKey: 'id',
        });
        Rating.belongsTo(models.Subcluster, {
            foreignKey: {
                name: 'subcluster_id',
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            targetKey: 'id',
        });
    };
    return Rating;
};
