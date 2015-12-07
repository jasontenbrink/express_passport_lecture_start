var express = require('express');
var router = express.Router();


//also check out req.session and req.sessionId
router.get('/', function(req,res){

  console.log('what is value of req.isAuthenticated()', req.isAuthenticated());
  //console.log('/user, what is on req.user?', req.user);
  //console.log('/user, sessionID: ',req.sessionID);
  //console.log('/user, session: ',req.session);

    res.send(req.user);

});

module.exports = router;
