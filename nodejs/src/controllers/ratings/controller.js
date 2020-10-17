
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


module.exports = {
    getRatings
};
