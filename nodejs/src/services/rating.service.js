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

const getRatings = async (country, category, date_start, date_end) => {
    try {
        console.log("--> ", country, category, date_start, date_end);
        const results = await Rating
    } catch(e) {
        console.error(e);
    }
};

module.exports = {
    saveRating,
    getRatings
};