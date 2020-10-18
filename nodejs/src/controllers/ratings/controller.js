
const ratingService = require('../../services/rating.service');
const clusterService = require('../../services/cluster.service');

const getRatings = async (req, res) => {

    const params = req.query;
    const {
        country, cluster_id, date_start, date_end
    } = params;
    console.log(req.params, cluster_id, date_start, date_end);
    if (!country) return res.status(400).json({ message: "country is mandatory"});
    const clusters = await clusterService.getCategories();

    const ratings = await ratingService.getRatingsByCluster(clusters, country, cluster_id, date_start, date_end);
    const ratingsCount = await ratingService.getRatingsCount(clusters, country, cluster_id, date_start, date_end);

    return res.status(200).json({
        cluster_avg: ratings,
        comments_count: ratingsCount
    });
};

const getComment = async (req, res) => {

    const params = req.query;
    const {
        country, label
    } = params;
    console.log(req.params);
    if (!country) return res.status(400).json({ message: "country is mandatory"});
    if (!label) return res.status(400).json({ message: "label is mandatory"});
    const clusterIds = await clusterService.getIdsByLabel(label);
    const ids = [];
    for (let i = 0; i < clusterIds.length; i++) {
        const element = clusterIds[i];
        ids.push(element.get('id'));
    }
    const rating = await ratingService.getRating(ids);
    
    return res.status(200).json(rating);
};

const updateComment = async (req, res) => {

    const params = req.body;
    const {
        id, cluster_id
    } = params;
    console.log(req.params);
    if (!id) return res.status(400).json({ message: "id is mandatory"});
    if (!cluster_id) return res.status(400).json({ message: "cluster_id is mandatory"});
    
    const rating = await ratingService.updateRating(id, cluster_id);
    
    return res.status(200).json(rating);
};

module.exports = {
    getRatings,
    getComment,
    updateComment
};
