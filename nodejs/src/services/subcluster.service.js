const models = require('../database/models');
const Subcluster = models.Subcluster;

const saveSubcluster = async (subclusters) => {
    console.log(`saving ${subclusters.length} subclusters`);
    try {
        await Subcluster.bulkCreate(subclusters);
    } catch (e) {
        console.error(e);
    }
};

module.exports = {
    saveSubcluster
};