var express = require('express');
var router = express.Router();
require('dotenv').config();
console.log(process.env);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
