var express = require('express');
router = express.Router();

router.get('/', function (req, res) {
  req.logout();
  res.send('success');

});

module.exports = router;
