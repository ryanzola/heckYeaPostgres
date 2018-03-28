const { Client } = require('pg');

// Database connection
const client = new Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  host: process.env.DB.HOST,
  ssl: true
}); 
client.connect();

exports.getAll = (req, res, next) => {
  client.query(
    'SELECT * FROM recipes', 
    (err, result) => {
    res.render('index', { recipes: result.rows });
  });
}

exports.addRecipe = (req, res, next) => {
  client.query(
    'INSERT INTO recipes(name, ingredients, directions, thumbnail) VALUES($1, $2, $3, $4)',
    [req.body.name, req.body.ingredients, req.body.directions, req.file.path],
    (err, result) => {
      if (err) console.log(err);

      res.redirect('/');      
    }
  );
}

exports.editRecipe = (req, res, next) => {
  client.query(
    'UPDATE recipes SET name=$1, ingredients=$2, directions=$3, thumbnail=$4 WHERE id=$5',
    [req.body.name, req.body.ingredients, req.body.directions, req.file.path, req.body.id],
    (err, result) => {
      if (err) {
        console.log(err);
        res.redirect('/');
      } else {
        res.redirect('/');
      }
    }
  );
}

exports.deleteRecipe = (req, res, next) => {
  client.query(
    'DELETE FROM recipes WHERE id = $1',
    [req.params.id],
    (err, result) => {
      res.sendStatus(200);
    }
  );
}