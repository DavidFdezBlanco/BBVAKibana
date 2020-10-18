const models = require('../database/models');
const Cluster = models.Cluster;

const saveCluster = async (clusters) => {
    console.log(`saving ${clusters.length} clusters`);
    try {
        return await Cluster.bulkCreate(clusters, { updateOnDuplicate: ['label'] });
    } catch (e) {
        console.error(e);
    }
};

const getCategories = async () => {
    try {
        return await Cluster.findAll({
            order: ['label']
        });
    } catch (e) {
        console.error(e)
    }
};

const getIdsByLabel = async (label) => {
    try {
        return await Cluster.findAll({
            where: {
                label: label
            },
            attributes: ['id']
        });
    } catch (e) {
        console.error(e);
    }
};

module.exports = {
    saveCluster,
    getCategories,
    getIdsByLabel
};