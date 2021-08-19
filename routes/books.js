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

/* GET all the books. */
router.get('/', asyncHandler( async (req, res) => {
  //const books = await Book.findAll();
  //console.log(books);
  res.render("index");
}));

module.exports = router;
