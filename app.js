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

 /**** ERROR HANDLERS *****/

 // 404 handler to catch undefined or non-existent route requests- Middleware for 404 not found error
 app.use((req, res, next) => {
  console.log('404 error handler called');
  const err = new Error();
  err.status = 404;
  err.message = "Oops! It looks like the page you're looking for does not exist."
  //next(err);
  res.render('not-found', { err });
})


// Global error handler
// 500 - Any server error
app.use((err,req,res,next) => {
  
  if (err){
    
    console.log('Global error handler called', err);
  }
  if (err.status === 404){
      console.log('404 error handler called');
      res.status(404).render('not-found',{ err });
  } else{
      console.log('500 error handler called');
      err.status = 500;
      err.message = `Oops!  It looks like something went wrong on the server. `;
      res.status(err.status).render('error', { err });
  }

});

module.exports = app;

/*(async () => {

  await sequelize.sync({ force: true });

  try {
    await sequelize.authenticate();
    console.log('Connection to the database successful!');
  } catch(error) {
    console.error('Error connecting to the database: ', error);
  }

})()*/