
const ratingService = require('../../services/rating.service');

const getRatings = async (req, res) => {

    const params = req.body;
    const {
        country, category, date_start, date_end
    } = params;
    const ratings = await ratingService.getRatings(country, category, date_start, date_end);

    return res.status(200).json(ratings);
};


module.exports = {
    getRatings
};
