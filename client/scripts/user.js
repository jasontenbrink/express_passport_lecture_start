$(document).ready(function(){
    console.log("Hey it loads!");

    $('#logout').on('click', logout);

    $.ajax({
        type: "GET",
        url: "/user",
        success: function(data){
            console.log(data);
            $("#welcome").text("Welcome, " +  data.email);
        }
    });
});

function logout(argument) {
  $.ajax({
    type: "GET",
    url: "/logout",
    success: function (data) {
      console.log('successful logout', data);

      if(data === "success"){
        window.location.assign('/');
      }
    }
  });
}
