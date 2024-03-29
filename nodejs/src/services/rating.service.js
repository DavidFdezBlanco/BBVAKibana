const models = require('../database/models');
const Rating = models.Rating;
const { QueryTypes } = models.Sequelize;
const moment = require('moment');

const clusterService = require('./cluster.service');

const saveRating = async (ratings) => {
    console.log(`saving ${ratings.length} Ratings`);
    try {
        await Rating.bulkCreate(ratings);
    } catch (e) {
        console.error(e);
    }
};

const getRatingsByCluster = async (clusters, country, clusterId, date_start, date_end) => {
    try {
        // const clusters = await clusterService.getCategories();
        let query = "SELECT cluster_id, avg(punctuation) from public.ratings r WHERE country=:country ";
        if (clusterId) query += ' AND cluster_id=:clusterId'
        if (date_start && date_end) {
            query += " AND date between :date_start and :date_end"
        }
        query += " group by cluster_id";
        const avgResults = await await models.sequelize.query(
            query,
            {
                replacements: { clusterId, country, date_start, date_end },
                type: QueryTypes.SELECT,
            },
        );
        let results = {};
        let labels = {};
        for (const cluster in clusters) {
            if (clusters.hasOwnProperty(cluster)) {
                const element = clusters[cluster];
                const label = element.get('label');
                //TODO: Refactor
                if (labels[label]) {
                    labels[label] = true;
                    let avg = avgResults.find((x) => x.cluster_id == element.get('id')) != undefined ? avgResults.find((x) => x.cluster_id == element.get('id')).avg : 0;
                    results[label] = (results[label] + avg ) / 2;
                } else {
                    results[label] = avgResults.find((x) => x.cluster_id == element.get('id')) != undefined ? avgResults.find((x) => x.cluster_id == element.get('id')).avg : 0;
                }
            }
        }
        return results;
    } catch (e) {
        console.error(e);
    }
};

const getRatingsCount = async (clusters, country, clusterId, date_start, date_end) => {
    try {
        // const clusters = await clusterService.getCategories();
        let query = "SELECT cluster_id, count(*) from public.ratings r WHERE country=:country";
        if (clusterId) query += ' AND cluster_id=:clusterId'
        if (date_start && date_end) {
            query += " AND date between :date_start and :date_end"
        }
        query += " group by cluster_id";
        const countResults = await await models.sequelize.query(
            query,
            {
                replacements: { clusterId, country, date_start, date_end },
                type: QueryTypes.SELECT,
            },
        );
        let results = {};
        let total = 0;
        for (const cluster in clusters) {
            if (clusters.hasOwnProperty(cluster)) {
                const element = clusters[cluster];
                const label = element.get('label');
                const count = countResults.find((x) => x.cluster_id == element.get('id')) != undefined ? countResults.find((x) => x.cluster_id == element.get('id')).count : 0;
                results[label] = parseInt(count);
                total += parseInt(count);
            }
        }
        return { results, total };
    } catch (e) {
        console.error(e);
    }
};

const getRating = async (clusterIds) => {
    try {
        return await Rating.findOne({
            where: {
                cluster_id: clusterIds
            },
            order: models.sequelize.random()
        });
    } catch (e) {
        console.error(e);
    }
};

const updateRating = async (id, cluster_id) => {
    try {
        return await Rating.update({
            cluster_id: cluster_id
        }, {
            where: { id: id }
        });
    } catch (e) {
        console.error(e);
    }
};

const getAvailableCountries = async () => {
    try {
        // const clusters = await clusterService.getCategories();
        let query = "SELECT distinct country from public.ratings";
        const countResults = await await models.sequelize.query(
            query,
            {
                type: QueryTypes.SELECT,
            },
        );
        return countResults;
    } catch (e) {
        console.error(e);
    }
};
module.exports = {
    saveRating,
    getRatingsByCluster,
    getRatingsCount,
    updateRating,
    getRating,
    getAvailableCountries
};
