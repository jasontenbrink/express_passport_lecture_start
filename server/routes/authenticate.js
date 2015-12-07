function requireAuth(req, res, next){
  // check if the user is logged in
  if(req.isAuthenticated()){
    console.log('I am authenticated!');
    next();
  }else{
  console.log('you do not have permission to see this page');
  req.session.messages = "You need to login to view this page";
  res.redirect('/login');//this redirect isn't working
  }
}

module.exports = requireAuth;
