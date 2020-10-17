const app = require('express')();
const bodyParser = require('body-parser');
require('custom-env').env(process.env.NODE_ENV, '../');

const { mustBeLoggedIn } = require('./middleware/auth');

const ratingsController = require('./controllers/ratings');
const auth = require('./controllers/auth');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/*
    PUBLIC ROUTES
 */

const port = process.env.PORT || 3001;

console.log(`Running on ${process.env.ENVIRONMENT} environment`);

app.use('/auth', auth);

if (process.env.ENVIRONMENT === 'development') {
    app.use('/', (req, res) => res.json({ message: 'You got lost?' }));
}

/*
    PRIVATE ROUTES UNDER /API
*/

// app.use('/api', mustBeLoggedIn);
app.use('/api/rating', ratingsController);

app.listen(port);

console.log(`Listening on port ${port}`);
