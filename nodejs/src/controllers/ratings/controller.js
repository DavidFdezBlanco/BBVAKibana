

const home = (req, res) => {
    return res.status(501).json({ message: 'Welcome to the API V1' });
};

module.exports = {
    home,
};
