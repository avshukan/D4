const cookieParser = require('cookie-parser'),
      createError = require('http-errors'),
      express = require('express'),
      insert = require('./api/insert/renderData'),
      logger = require('morgan'),
      path = require('path');

const mongodb = require('./api/db/mongodb'),
      sessionCheck = require('./api/session/check');

const d2Router = require('./routes/d2'),
      d4Router = require('./routes/d4'),
      helpRouter = require('./routes/help'),
      indexRouter = require('./routes/index'),
      loginRouter = require('./routes/login'),
      printRouter = require('./routes/print'),
      logoutRouter = require('./routes/logout'),
      checksRouter = require('./routes/checks'),
      doctorsRouter = require('./routes/doctors'),
      refbooksRouter = require('./routes/refbooks'),
      patientsRouter = require('./routes/patients'),
      recordsRouter = require('./routes/records');
      

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(insert.renderData);
app.use(mongodb);       // Подключаем базу данных
app.use(sessionCheck);  // Проверяем наличие сессии у пользователя

app.use('/', indexRouter);
app.use('/d2', d2Router);
app.use('/d4', d4Router);
app.use('/help', helpRouter);
app.use('/print', printRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/checks', checksRouter);
app.use('/doctors', doctorsRouter);
app.use('/refbooks', refbooksRouter);
app.use('/patients', patientsRouter);
app.use('/records', recordsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
