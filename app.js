var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').__express);
app.set('view engine', 'ejs');

var users = require('./routes/users');
var links = require('./routes/links');
var index = require('./routes/index');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));//use public folder
app.use(express.static(path.join(__dirname, 'bower_components')));//use bower_components folder

app.use('/', index);
app.use('/users', users);


var suggest = require('suggestion');
app.use('/suggestion', function (req, res, next){
	var q = req.query.q;
	suggest(q, function (err, suggestions){
		if(err) res.status(404);
		else res.json(suggestions);
	});
});

var google = require('google');
var wikipedia = require('wikipedia-js');
app.use('/links', function(req, res, next){
	var q = req.query.q;


	//wikipedia-js
	var options = {query: q, format: "json", summaryOnly: true};
	wikipedia.searchArticle(options, function(err, htmlWikiText){
	    if(err){
	      console.log("wikipedia An error occurred[query=%s, error=%s]", q, err);
	    }
	    console.log("wikipedia Query successful[query=%s, html-formatted-wiki-text=%s]", q, htmlWikiText);
    });

	//google
	google.resultsPerPage = 3;
	google(q, function(err, next, links){
		if(err) res.status(404);
		else {
      var linksBuilder = [];
      for(var i=0; i<links.length; i++){
        if(links[i].link != null) linksBuilder[i] = links[i];
      }
      res.json(linksBuilder);
    }
	});
});



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

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
