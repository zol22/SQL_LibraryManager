var express = require('express');
var router = express.Router();
const Book = require('../models').Book; 


/* Handler function to wrap each route. */
function asyncHandler(callback){
  return async(req, res, next) => {
    try {
      await callback(req, res, next)
    } catch(error){
      // Forward error to the global error handler
      next(error);
    }
  }
}

// Show the full list of books. 
router.get('/', asyncHandler( async (req, res) => {
  const books = await Book.findAll({
    attributes: ['id', 'title', 'author', 'genre', 'year'],
    order: [['title', 'ASC']],
  });
  res.render("index", { books, title: 'Library' });
}));


// Show the create new book form
router.get('/new', asyncHandler( async (req, res) => {
  res.render('books/new-book', { book: {}, title: 'New Book' });
}));

// Post a new book to the database
router.post('/new', asyncHandler( async (req, res) => {
  //res.render("index");
}));

// Show book detail form
router.get('/:id', asyncHandler( async (req, res) => {
  //res.render("index");
}));

// Updates book info in the databse
router.post('/:id', asyncHandler( async (req, res) => {
  //res.render("index");
}));

//  Deletes a book. Careful, this can’t be undone. It can be helpful to create a new “test” book to test deleting
router.post('/:id/delete', asyncHandler( async (req, res) => {
  //res.render("index");
}));


module.exports = router;
