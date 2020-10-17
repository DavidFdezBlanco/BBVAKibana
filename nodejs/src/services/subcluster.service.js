const models = require('../database/models');
const Subcluster = models.Subcluster;

const saveSubcluster = async (subclusters) => {
    console.log(`saving ${subclusters.length} subclusters`);
    try {
        await Subcluster.bulkCreate(subclusters, { updateOnDuplicate: ['label'] });
    } catch (e) {
        console.error(e);
    }
};

const getSubcategories = async () => {
    try {
        return await Subcluster.findAll({
            order: ['cluster_id'],
            attributes: ['id', 'label'],
            include: [{
                model: models.Cluster,
                attributes: ['id', 'label']
            }]
        });
    } catch (e) {
        console.error(e)
    }
};

module.exports = {
    saveSubcluster,
    getSubcategories
};