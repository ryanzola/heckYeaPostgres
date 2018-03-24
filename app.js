'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cons = require('consolidate');
const dust = require('dustjs-helpers');
const { Client } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Database connection
const client = new Client({
  user: process.env.DB_USER,
  host: 'localhost',
  database: 'recipiebookdb',
  password: process.env.DB_PASSWORD,
  port: 5433
});
client.connect();

// Assign Dust engine to .dust files
app.engine('dust', cons.dust);

// Set default ext .dust
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

// Set public folder
app.use(express.static(path.join(__dirname + '/public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res, next) => {
  client.query('SELECT * FROM recipes', (err, result) => {
    res.render('index', { recipes: result.rows });
  });
});

app.post('/add', (req, res, next) => {
  client.query(
    'INSERT INTO recipes(name, ingredients, directions) VALUES($1, $2, $3)',
    [req.body.name, req.body.ingredients, req.body.directions],
    (err, result) => {
      if (err) {
        console.log(err);
        res.redirect('/', 400);
      } else {
        res.redirect('/', 201);
      }
    }
  );
});

app.post('/edit', (req, res, next) => {
  client.query(
    'UPDATE recipes SET name=$1, ingredients=$2, directions=$3 WHERE id=$4',
    [req.body.name, req.body.ingredients, req.body.directions, req.body.id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.redirect('/');
      } else {
        res.redirect('/');
      }
    }
  );
});

app.delete('/delete/:id', (req, res, next) => {
  client.query(
    'DELETE FROM recipes WHERE id = $1',
    [req.params.id],
    (err, result) => {
      res.sendStatus(200);
    }
  );
});

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
