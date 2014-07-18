var express = require('express');
var expsession = require('express-session');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var routes = require('./routes');
var MongoStore = require('connect-mongo')(expsession);
var settings = require('./settings');
var flash = require('connect-flash');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(flash());
app.use(cookieParser());
app.use(expsession({
    resvae:true,
    secret:settings.cookieSecret,
    store:new MongoStore({
        db:settings.db
    })
}));
app.use(partials());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req,res,next){
    res.locals.user=req.session.user;
    var error=req.flash('error');
    var success=req.flash('success');
    res.locals.error=error.length?error:null;
    res.locals.success=success.length?success:null;
    next();
});
routes(app);


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
