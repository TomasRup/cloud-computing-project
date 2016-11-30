'use strict';

// Dependencies
const express = require('express')
const path = require('path');
const bodyParser = require('body-parser');

// Injecting constants
const MONGO_URL = "mongodb://localhost:27017/test";
const FRONTEND_APP_LOCATION = path.join(__dirname, '/public');


// Creating an express app
const app = express();


// Creating DAO layer
const configurationDao = require('./app/dao/ConfigurationMongoDAO')(MONGO_URL);


// Creating service layer
const configurationService = require('./app/services/ConfigurationService')(configurationDao);


// Creating client layer
app.use(bodyParser.urlencoded({ extended: false }));
const deviceController = require('./app/controllers/DeviceController')(app, configurationService);
const webController = require('./app/controllers/WebController')(app, configurationService, FRONTEND_APP_LOCATION);


// Starting the web application
app.listen(8080);
