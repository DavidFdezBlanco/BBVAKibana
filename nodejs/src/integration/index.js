const fs = require('fs')
const csv = require('csv-parser');
const path = require('path');
const clusterService = require('../services/cluster.service');
const subclusterService = require('../services/subcluster.service')
const ratingService = require('../services/rating.service');

const clusters = [];
const subclusters = [];
const ratings = [];

const arguments = process.argv.slice(2);
console.log('arguments: ', arguments);

const fileUrlToIntegrate = path.resolve('./src/integration') + '/' + arguments[0];
console.log("[INFO] integrating : ", fileUrlToIntegrate);

function generateCluster(id, label, words) {
    let cluster = { id: parseInt(id), label, words: words.split() };
    // console.log("[INFO] Generating cluster", cluster);
    return cluster;
};

function generateSubcluster(id, label, words, clusterId) {
    const subcluster = { id: parseInt(id), label, words: words.split(), cluster_id: parseInt(clusterId) };
    // console.log("[INFO] Generating subcluster", subcluster);
    if (clusters.map(function (e) { return e.id; }).indexOf(subcluster.cluster_id) < 0) {
        console.warn("[WARNING] cluster not found");
    }
    return subcluster;
};

function generateRating(punctuation, comment, date, lat, lng, country, cluster_id, subcluster_id) {
    let rating = {
        punctuation: parseFloat(punctuation), comment, date: new Date(date), lat: parseFloat(lat), lng: parseFloat(lng), country,
        cluster_id: parseInt(cluster_id), subcluster_id: parseInt(subcluster_id)
    };
    // console.log("[INFO] Generating rating", rating);
    if (clusters.map(function (e) { return e.id; }).indexOf(rating.cluster_id) < 0) {
        console.warn("[WARNING] cluster not found");
    }
    if (subclusters.map(function (e) { return e.id; }).indexOf(rating.subcluster_id) < 0) {
        console.warn("[WARNING] subcluster not found");
    }
    return rating;
};

fs.createReadStream(fileUrlToIntegrate)
    .pipe(csv({ headers: false }))
    .on('data', function (row) {
        const element = row;
        const typeData = element[0];
        switch (parseInt(typeData)) {
            case 0: //cluster
                const cluster = generateCluster(element[1], element[2], element[3]);
                clusters.push(cluster);
                break;
            case 1: //subcluster
                const subcluster = generateSubcluster(element[1], element[2], element[3], element[4]);
                subclusters.push(subcluster);
                break;
            case 2: //rating
                const rating = generateRating(element[1], element[2], element[3], element[4], element[5], element[6], element[7], element[8]);
                ratings.push(rating);
                break;
            default:
                break;
        }
    })
    .on('end', async function () {
        console.log("clusters");
        console.table(clusters);
        console.log("subclusters");
        console.table(subclusters);
        console.log("ratings");
        console.table(ratings);
        await clusterService.saveCluster(clusters);
        await subclusterService.saveSubcluster(subclusters);
        await ratingService.saveRating(ratings);
    });
