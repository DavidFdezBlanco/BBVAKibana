const loginService = require('../../services/LoginService');
const tokenService = require('../../services/TokenService');

// To be done
function logout(req, res) {
    res.json({ message: 'logout' });
}

/**
 * Login and token creation
 * @function
 */
const login = async (req, res) => {
    try {
        const params = req.body;
        const username = params.username;
        const passwordNoHashed = params.password;

        console.log(username);
        console.log(passwordNoHashed);

        if (username == null || passwordNoHashed == null) {
            return res.status(400).json({ Error: 'Request parameter undefined' });
        }
        try {
            const user_id = await loginService.getUserId(username, passwordNoHashed);
            console.log(`user id ${user_id}`);
            try {
                const newToken = await tokenService.createToken(user_id);
                return res.status(200).json({ token: newToken });
            } catch (e) {
                return res.status(400).json({ Error: 'Error creating token' });
            }
        } catch (error) {
            return res.status(400).json({ Error: 'Error finding user' });
        }
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

module.exports = {
    login,
};
