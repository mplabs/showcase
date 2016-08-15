
const bodyParser = require('body-parser');
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const morgan = require('morgan');
const mustache = require('mustache-express');

const app = express();
const config = require('./config.json');

// Setup view engine
app.engine('html', mustache());
app.set('view engine', 'html'); // register file extension for partials
app.set('views', __dirname + '/views');

// Setup bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Init logger
app.use(morgan('combined'));

// Static routing
app.use('/', express.static('public'));
app.use('/storage', express.static('storage'));

MongoClient.connect(config.db.url, (err, db) => {
  if (err) { throw Error(err); }

  // Make global db reference
  app.locals.db = db;

  // Setup controllers
  app.use(require('./controllers')(app));

  app.listen(config.server.port, config.server.host, () => {
    console.log("App is running on port 3000...");
  });
});