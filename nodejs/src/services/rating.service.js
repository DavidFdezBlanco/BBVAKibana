const models = require('../database/models');
const Rating = models.Rating;

const saveRating = async (ratings) => {
    console.log(`saving ${ratings.length} Ratings`);
    try {
        await Rating.bulkCreate(ratings);
    } catch (e) {
        console.error(e);
    }
};

module.exports = {
    saveRating
};