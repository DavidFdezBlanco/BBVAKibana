const models = require('../database/models');
const Rating = models.Rating;

const saveRating = async (Ratings) => {
    console.log(`saving ${Ratings.length} Ratings`);
    try {
        await Rating.bulkCreate(Ratings);
    } catch (e) {
        console.error(e);
    }
};

module.exports = {
    saveRating
};