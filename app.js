var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var books = require('./routes/books');
const { sequelize } = require('./models');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/books', books);


(async () => {

  await sequelize.sync();

  try {
    await sequelize.authenticate();
    console.log('Connection to the database successful!');
  } catch(error) {
    console.error('Error connecting to the database: ', error);
  }

})()

 /**** ERROR HANDLERS *****/

 /*  
  Middleware for 404 not found error
  In express, 404 responses are not considered an "error" so the global error handler
  will not catch them. Because of that, you need a specific middleware function to handle them.
  We dont need to pass it to next because there's nothing else that needs to be done.
 */
 app.use((req, res) => {
  console.log('404 error handler called');
  const err = new Error();
  err.status = 404;
  err.message = "Oops! It looks like the page you're looking for does not exist." 
  res.render('not-found', { err });
})


/* 
  Global error handler
  500 - Any server error
*/
app.use((err,req,res,next) => {
  console.log("Global error handler")
  
  /*if (err.status === 404){
    console.log('404 Global error handler called');
    res.status(404).render('not-found',{err});
  } else {
      err.message = err.message || "Oops!  It looks like something went wrong on the server."
      res.status(err.status || 500).render('error', {err});
  }*/
  
  if (!err.status) { 
    console.log(err.status);         
    err.status = 500;
    err.message = 'Oops!  It looks like something went wrong on the server.'
    res.render('error', { err })
   } else {
    res.status(err.status || 500)
    res.render('error', { err })
   }
});

module.exports = app;