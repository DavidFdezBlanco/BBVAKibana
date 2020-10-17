const app = require('express')();
const bodyParser = require('body-parser');
require('custom-env').env(process.env.NODE_ENV, './');

const ratingsController = require('./controllers/ratings');
const clusterController = require('./controllers/cluster');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*
    PUBLIC ROUTES
 */

const port = process.env.PORT || 3001;

console.log(`Running on ${process.env.ENVIRONMENT} environment`);

/*
    PRIVATE ROUTES UNDER /API
*/

app.use('/api/ratings', ratingsController);
app.use('/api/cluster', clusterController);

app.listen(port);

console.log(`Listening on port ${port}`);
