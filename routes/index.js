var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	if (req.cookies.lpu === undefined)
	{
		
	}
  res.render('index', { title: 'Express' });
});

module.exports = router;
