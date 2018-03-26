const express = require('express');
const multer = require('multer');
const router = express.Router();

// import controller
const RecipeController = require('../controllers/recipie');

// storage options
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, '/uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  dest: './uploads/'
});

router.get('/', RecipeController.getAll);
router.post('/add', upload.single('thumbnail'), RecipeController.addRecipe);
router.post('/edit', upload.single('thumbnail'), RecipeController.editRecipe);
router.delete('/delete/:id', RecipeController.deleteRecipe);

module.exports = router;
