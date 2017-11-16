/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
const baseURL = "http://localhost:8080/Workshop3/webresources";

$(document).on("submit", "form#login", function(event) {
    event.preventDefault();
    console.log("Username:" + $("#username").val());
    var login = {"username" : $("#username").val(),
            "password" : $("#password").val()};
    var loginJson = JSON.stringify(login);
    console.log(loginJson);
    
    $.ajax({
        url: "http://localhost:8080/Workshop3/login",
        method: "POST",
        data: loginJson,
        contentType: "application/json",
        error: function() {
            console.log("Error in function login");
        },
        success: function(data) {
            console.log("login succesful");
            window.location.href="http://localhost:8080/home.html#";
            location.reload();
        }       
    });
});
