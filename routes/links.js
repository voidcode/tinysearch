var express = require('express');
var router = express.Router();

//in-cope models
var google = require('google');
/* GET home page. */
router.get('/links', function(req, res, next) {
	debugger;
	google.reslutsPerPage = 3;
	console.log(res.body.query);
	google(res.body.query, function(err, next, links){
		if(err) res.status(404);
		else res.json(links);
	});
});

module.exports = router;