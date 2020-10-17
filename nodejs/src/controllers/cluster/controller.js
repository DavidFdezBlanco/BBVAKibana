
const clusterService = require('../../services/cluster.service');
const subclusterService = require('../../services/subcluster.service');

const getCategories = async (req, res) => {

    const clusters = await clusterService.getCategories();

    return res.status(200).json(clusters);
};

const getSubcategories = async (req, res) => {
    const subclusters = await subclusterService.getSubcategories();
    return res.status(200).json(subclusters);
};

module.exports = {
    getCategories,
    getSubcategories
};
