const models = require('../database/models');
const Cluster = models.Cluster;
const saveCluster = async (clusters) => {
    console.log(`saving ${clusters.length} clusters`);
    try {
        return await Cluster.bulkCreate(clusters, { updateOnDuplicate: ['label', 'words'] });
    } catch (e) {
        console.error(e);
    }
};

module.exports = {
    saveCluster
};