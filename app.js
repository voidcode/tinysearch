var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var google = require('google');
var wikipedia = require('wikipedia-js');
var orm = require('orm');
var _ = require('lodash');
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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));//use public folder
app.use(express.static(path.join(__dirname, 'bower_components')));//use bower_components folder

app.use('/', index);
app.use('/users', users);


//----------------------------------------------------------------------------------
//define db-models
app.use(orm.express('mysql://root:sascha302@localhost/tinysearch', {
  define: function (db, models, next){
    //USERS
    models.Users = db.define('users', {
      id: Number,
      createat: Date,
      ip: String,
      username: String,
      password: String
    });

    //LINKSMETA
    models.Linksmeta = db.define('linksmeta', {
      id: Number,
      hash: String,
      navlev: Number,
      fk_linksid: Number,
      removelink: Boolean,
      meta_description: String,
      meta_keyword: String,
      meta_author: String,
      fk_topdomainid: Number,
      local_pagerank: Number,
      remote_pagerank: Number
    });

    //LINKS
    models.Links = db.define('links', {
      id: Number,
      createat: Date,
      title: String,
      url: String
    });

    //UserSearchWords
    models.Searchwords = db.define('searchwords', {
      id: Number,
      createat: Date,
      query: String
    });

    //LinksRelatedBySearchWord
    models.Linksrelatedbysearchword = db.define('linksrelatedbysearchword', {
      id: Number,
      fk_usersearchword_id: Number,
      fk_linkid: Number
    });

    //sync all models to database
    db.sync(function(){
      //create pre data like use
    });
    next();
  }
}));
//----------------------------------------------------------------------------------

//google suggestion
var suggest = require('suggestion');
app.use('/suggestion', function (req, res, next){
	var q = req.query.q;
	suggest(q, function (err, suggestions){
		if(err) res.status(404);
		else res.json(suggestions);
	});
});

//google
function getGoogleLinks(q, resultsperpage){

}
//wikipedia-js
function getWikipedia(q){
  var options = {query: q, format: "json", summaryOnly: true};
  wikipedia.searchArticle(options, function(err, htmlWikiText){
      if(err){
        console.log("wikipedia An error occurred[query=%s, error=%s]", q, err);
      }
      //TODO pase link then add to return
      console.log("wikipedia Query successful[query=%s, html-formatted-wiki-text=%s]", q, htmlWikiText);
    });
}

//links
app.use('/links', function(req, res, next){
  var data = _.pick(req.query, 'q');
  var SearchwordsObj = req.models.Searchwords;
  console.log('/links: lookup, ('+data.q+') Is query in db...?');
  req.models.Searchwords.exists({ query:req.query.q }, function (err, exists){
    if(exists){//Yes query is in table 'searchwords'
      console.log('/Yes.... ');

      //get query from 'Searchwords' lookup 
    } else {
      console.log('/No....');
      
      //so we need to create this query in searchquery table.
      req.models.Searchwords.create({
        createat: new Date(),
        query: data.q
      }, function (err, searchwords){
        if(err) console.error('Searchwords.create... Error while trying to create q!!'+err);
        else {
          google.resultsPerPage = 5;

          //get links from google
          google(data.q, function(err, next, links){
            if(!err) {
              res.json(links);
              //save query in local-database...
              //save linksBuilder in local-database..
              for(var i=0; i<links.length; i++){
                req.models.Links.one({ 
                  url: links[i].href 
                }, function(err, Links){ 
                  if(!err) console.log('Link fund! -->links['+i+'].href-->'+JSON.stringify(links[i]));
                });
              }
            }
          });
        }
      });
    }
  });
});
/*
//add new link to table Links
                        req.models.Links.create({ 
                          createat: new Date(),
                          title: links[i].title,
                          url: links[i].href
                        }, function(err, items){
                          if(err) console.error(err);
                        });
*/

//TODO define restapi
app.use(express.Router());

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
