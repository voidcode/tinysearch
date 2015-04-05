var express = require('express');
var router = express.Router();

//in-cope models
var google = require('google');
/* GET home page. */
/**

LINKS URL QUERY to search links.db by url.
_______________________________________________________________///***
?q=somequery
?like=%somequery% OR ?like=somequery% OR ?like=%somequery 
?regexp=^[a-d]
--->>
&lg=en
&providers=[
	"localhost:3000",
	"google.com",
	"youtube.com"
],
&createat=34443443434343443
&localrank=[10,7]
&remoterank=[10, 7]
&start=0&end=100
&safesearch=true
_______________________________________________________________///***


**/
router.get('/links', function(req, res, next) {
	console.log('LINKS .....>>>');
	res.send('sds');
});

module.exports = router;