'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cons = require('consolidate');
const dust = require('dustjs-helpers');
const { Client } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

const recipeRoutes = require('./api/routes/recipe')

// Database connection
var client = new pg.Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  host: process.env.DB.HOST,
  ssl: true
}); 
client.connect();



// Assign Dust engine to .dust files
app.engine('dust', cons.dust);

// Set default ext .dust
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

// Set public folder
app.use(express.static(path.join(__dirname + '/public')));

// Set uploads folder for storing image files
app.use("/uploads", express.static('uploads'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', recipeRoutes);

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
