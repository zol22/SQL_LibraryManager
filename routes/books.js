var express = require('express');
var router = express.Router();
const Book = require('../models').Book; 


/* 
  Handler function to wrap each route. 
  Here, it's the only part of the code that's handling rejected Promises 
  returned from the database calls. 
  It catches an error (or a rejected promise) that occurs in a route and 
  forwards the error to the global error handler (in app.js) 
  with the next() method.
*/
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

/* 
  Post a new book to the database.
  Creating a Book model instance without a title or an author passes an error 
  into the asyncHandler function's catch block. The server, however, should not respond 
  with a 500 status in this case, because that would mean there is a server error. Instead, 
  the route will re-render the "new-book" view to display the validation error message.
  When validation fails, Sequelize throws a SequelizeValidationError with the validator message. 
  Before any errors in the create book post routes are caught by asyncHandler's 
  catch block, we'll first check if it's a SequelizeValidationError.
  The build instance holds the properties / values of the Book being created via req.body. 
  It will get stored in the database by the create() method once the user submits the form 
  with a valid title and author.
*/
router.post('/new', asyncHandler( async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body) // req.body contains all the user inputs
    res.redirect('/books');

  } catch (error){
    if (error.name === "SequelizeValidationError") { // checking the error
      book = await Book.build(req.body);
      res.render("books/new-book", { book, errors: error.errors, title: "New Book" });
    } else {
        throw error;
      }
 
  }
}));

/* 
  Show book detail form
  If you visit a book that doesn't exist in the database (/books/101), or
  run a findByPk() with an invalid ID, the response returns errors and a
  500 status code. The server cannot process the request because the entry
  is not found.
  Send a 404 code to the client to let users know that the server is unable
  to locate the requested book
*/
router.get('/:id', asyncHandler( async (req, res, next) => {
  const book = await Book.findByPk(req.params.id)
  if (book) {
    res.render("books/update-book", { book, errors: false, title: "Update Book" });
  } else {
    throw new Error();
  }
}));

// Updates book info in the databse
router.post('/:id', asyncHandler( async (req, res,next) => {
  let book;
  try {
      book = await Book.findByPk(req.params.id)
      if (book) {
          await book.update(req.body)
          res.redirect('/books')
      } else {
        //next
        throw new Error();
      }
  } catch (error) {
      if (error.name === 'SequelizeValidationError') {
          book = await Book.build(req.body)
          book.id = req.params.id; // make sure correct book gets updated
          res.render('books/update-book', { book, errors: error.errors, title : "Update Book" })
      } else {
        //next
        throw error;
      }
  }
}));

/* Delete book form */
router.get("/:id/delete", asyncHandler(async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("books/delete", { book, title: "Delete Book" });
  } else {
    next();
  }
 
}));
//  Deletes a book. Careful, this can’t be undone. It can be helpful to create a new “test” book to test deleting
router.post('/:id/delete', asyncHandler( async (req, res, next) => {
  
  const book = await Book.findByPk(req.params.id)
  if (book) {
    await book.destroy(req.body);
    res.redirect('/books')
    } 
  else {
    next();
  }
}));


module.exports = router;
