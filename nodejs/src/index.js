const app = require('express')();
const bodyParser = require('body-parser');
require('custom-env').env(process.env.NODE_ENV);

const { mustBeLoggedIn } = require('./middleware/auth');

const homeController = require('./controllers/home');
const auth = require('./controllers/auth');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/*
    PUBLIC ROUTES
 */

const port = process.env.PORT || 3000;

console.log("Running on " + process.env.ENVIRONMENT + " env");

app.use('/auth', auth);

if (process.env.ENVIRONMENT === 'development') {
    app.use('/', (req, res) => res.json({ message: "You got lost?" }));
}

/*
    PRIVATE ROUTES UNDER /API
*/

// app.use('/api', mustBeLoggedIn);
app.use('/api', homeController);

app.listen(port);

console.log(`Listening on port ${port}`);
